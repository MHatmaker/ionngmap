/*global require, define, google, console, document, dojo, esri, alert, setTimeout, window, WebMap, all */
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('StartupArcGIS setup');

    // require(['libs/MapHosterArcGIS', 'libs/utils', 'esri',
    // // 'https://js.arcgis.com/4.1/dojo/domReady!', 'https://js.arcgis.com/4.1/esri/WebMap', 'https://js.arcgis.com/4.1/esri/views/MapView']);
    // 'esri/WebMap', 'esri/views/MapView', 'dojo/domReady!'], //);
    // require(['esri/views/MapView', 'esri/WebMap', 'dojo/domReady!']);

    define([
        'libs/MapHosterArcGIS',
        'controllers/PusherSetupCtrl',
        'libs/MLConfig',
        'libs/PusherConfig',
        'libs/utils',
        'esri/map'
    ], function (MapHosterArcGIS, PusherSetupCtrl, MLConfig, PusherConfig, utils, esrimap) { // WebMap, MapView, all) { // PusherSetupCtrl, MLConfig, utils, esri, WebMap, MapView, all) {
        console.log('StartupArcGIS define');
        var
            StartupArcGIS  (mapNo, mapconfig, mapHosterSetupCallback) {

                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.aMap = null;
                this.aView = null;
                this.mlconfig = mapconfig;
                this.mlconfig.setMapNumber(mapNo);
                this.mlconfig.setUserId(PusherConfig.getUserName() + mapNo);
                this.mapHosterSetupCallback = mapHosterSetupCallback;
                console.log("Setting mapNumber to " + this.mapNumber);


                var
                    self = this,
                    selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0", // Requires a space after map ID
                    previousSelectedWebMapId = selectedWebMapId,
                    zoomWebMap = null,
                    pointWebMap = [null, null],
                    channel = null,
                    pusher = null,

                    configOptions,

                    showLoading  () {
                        utils.showLoading();
                        self.aMap.disableMapNavigation();
                        self.aMap.hideZoomSlider();
                    },

                    hideLoading  (error) {
                        utils.hideLoading(error);
                        self.aMap.enableMapNavigation();
                        self.aMap.showZoomSlider();
                    },
                    placeCustomControls  () {
                        var $inj = self.mlconfig.getInjector(),
                            ctrlSvc = $inj.get('MapControllerService'),
                            mapCtrl = ctrlSvc.getController();
                            // mapCtrl = MapControllerService.getController();
                        mapCtrl.placeCustomControls();
                    },

                    setupQueryListener  () {
                        var $inj = self.mlconfig.getInjector(),
                            ctrlSvc = $inj.get('MapControllerService'),
                            mapCtrl = ctrlSvc.getController();
                        // var mapCtrl = MapControllerService.getController();
                        mapCtrl.setupQueryListener();
                    },
                    getMap  () {
                        return self.aMap;
                    },

                    getMapNumber  () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance  (ndx) {
                        return self.mapHoster;
                    },

                    initUI  () {
                      //add scalebar or other components like a legend, overview map etc
                        // dojo.parser.parse();
                        console.debug(self.aMap);
                        var
                            curmph = null,
                            $inj,
                            mapInstanceSvc,
                            CurrentMapTypeSvc,
                            // mapTypeSvc,
                            currentPusher,
                            currentChannel;

                        /* Scalebar refuses to appear on map.  It appears outside the map on a bordering control.
                        var scalebar = new esri.dijit.Scalebar({
                            map: aMap,
                            scalebarUnit:"english",
                            attachTo: "top-left"
                        });
                         */

                        console.log("start MapHoster with center " + pointWebMap[0] + ", " + pointWebMap[1] + ' zoom ' + zoomWebMap);
                        console.log("self.mapHoster : " + self.mapHoster);
                        if (self.mapHoster === null) {
                            console.log("self.mapHoster is null");
                            // alert("StartupArcGIS.initUI : selfDetails.mph == null");
                            // placeCustomControls();
                            self.mapHoster = new MapHosterArcGIS.MapHosterArcGIS();
                            self.mapHoster.config(self.aMap, zoomWebMap, pointWebMap, self.mlconfig);
                            $inj = self.mlconfig.getInjector();
                            mapInstanceSvc = $inj.get('MapInstanceService');
                            mapInstanceSvc.setMapHosterInstance(self.mapNumber, self.mapHoster);
                            self.mlconfig.setMapHosterInstance = self.mapHoster;
                            CurrentMapTypeSvc = $inj.get('CurrentMapTypeService');
                            CurrentMapTypeSvc.setCurrentMapType('arcgis');
                            placeCustomControls();
                            setupQueryListener();
                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("StartupArcGIS.initUI : selfDetails.mph as initially null and should now be set");
                            // console.debug(MapHosterArcGIS);
                            // console.debug(pusherChannel);
                            // curmph = self.mapHoster;

                            // $inj = self.mlconfig.getInjector();
                            // console.log("$inj");
                            // console.debug($inj);
                            // mapTypeSvc = $inj.get('CurrentMapTypeService');
                            // curmph = mapTypeSvc.getSelectedMapType();
                            // console.log('selected map type is ' + curmph);

                            self.pusher = PusherSetupCtrl.createPusherClient(
                                self.mlconfig,
                                function (callbackChannel, userName) {
                                    console.log("callback - don't need to setPusherClient");
                                    console.log("It was a side effect of the createPusherClient:PusherClient process");
                                    PusherConfig.setUserName(userName);
                                    // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
                                },
                                {'destination' : "destPlaceHolder", 'currentMapHolder' : self.mapHoster, 'newWindowId' : "windowIdPlaceholder"}
                            );
                            if (!self.pusher) {
                                console.log("failed to create Pusher in StartupGoogle");
                            }

                        } else {
                            console.log("self.mapHoster is something or other");
                            // $inj = self.mlconfig.getInjector();
                            // mapTypeSvc = $inj.get('CurrentMapTypeService');
                            // curmph = mapTypeSvc.getSelectedMapType();
                            // console.log('selected map type is ' + curmph);
                            self.mlconfig.setMapHosterInstance = self.mapHoster;
                            pusherChannel = PusherConfig.masherChannel(false);
                            pusher = PusherSetupCtrl.createPusherClient(
                                self.mlconfig,
                                function (callbackChannel, userName) {
                                    console.log("callback - don't need to setPusherClient");
                                    console.log("It was a side effect of the createPusherClient:PusherClient process");
                                    PusherConfig.setUserName(userName);
                                    // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
                                },
                                {'destination' : "destPlaceHolder", 'currentMapHolder' : curmph, 'newWindowId' : "windowIdPlaceholder"}
                            );
                            currentPusher = pusher;
                            currentChannel = channel;
                            self.mapHoster.config(self.aMap, zoomWebMap, pointWebMap, self.mlconfig);

                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("use current pusher - now setPusherClient");
                            self.mapHoster.setPusherClient(currentPusher, currentChannel);
                            placeCustomControls();  // MOVED TEMPORARILY on 3/15
                            setupQueryListener();
                        }
                    },

                    initializePostProc  (newSelectedWebMapId) {
                        var
                            mapDeferred,
                            aMap = null,
                            mapInstanceSvc,
                            $inj;
                        //     mapOptions = {},
                        window.loading = dojo.byId("loadingImg");
                        //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications.
                        esri.config.defaults.geometryService =
                            new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

                        console.log("StartupArcGIS configure with map no. " + self.mapNumber);
                        console.log("configOptions.webmap will be " + selectedWebMapId);
                        //specify any default settings for your map
                        //for example a bing maps key or a default web map id
                        configOptions = {
                            // webmap: '4b99c1fb712d4fe694805717df5fadf2', // selectedWebMapId,
                            webmap: selectedWebMapId,
                            title: "",
                            subtitle: "",
                            //arcgis.com sharing url is used modify this if yours is different
                            sharingurl: "http://arcgis.com/sharing/content/items",
                            //enter the bing maps key for your organization if you want to display bing maps
                            bingMapsKey: "/*Please enter your own Bing Map key*/"
                        };
                        if(newSelectedWebMapId) {
                            configOptions.webmap = newSelectedWebMapId;
                        }

                        console.log('StartupArcGIS ready to instantiate Map Hoster with map no. ' + self.mapNumber);                        // return self.mapHoster;
                        esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
                        esri.config.defaults.io.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";

                        //create the map using the web map id specified using configOptions or via the url parameter
                        // var cpn = new dijit.layout.ContentPane({}, "map_canvas").startup();

                        // dijit.byId("map_canvas").addChild(cpn).placeAt("map_canvas").startup();
                        console.log("call for new WebMap with webmap id " + configOptions.webmap);

                        // self.aMap = new WebMap({portalItem : {id: configOptions.webmap}});
                        // self.aMap = new WebMap({portalItem : {id: 'e691172598f04ea8881cd2a4adaa45ba'}});

                        // self.aMap = new WebMap({portalItem : {id: 'a4bb8a91ecfb4131aa544eddfbc2f1d0'}});
                        // self.aView = new MapView({
                        //     map : self.aMap,
                        //     container : document.getElementById("map" + self.mapNumber),
                        //     zoom : 14,
                        //     center : [-87.620692, 41.888941]
                        // });
                        // initUI();
                        /*
                        self.aMap.load()
                            .then(function () {
                              // load the basemap to get its layers created
                              console.log('map.then callback function');
                                return self.aMap.basemap.load();
                            })
                            .then(function () {

                                if (previousSelectedWebMapId !== selectedWebMapId) {
                                    previousSelectedWebMapId = selectedWebMapId;
                                    //dojo.destroy(map.container);
                                }
                                self.mapHoster = new MapHosterArcGIS.MapHosterArcGIS(self.aMap, self.mapNumber, self.mlconfig);
                                self.mapHosterSetupCallback(self.mapHoster, self.aMap);
                                self.aView = new MapView({
                                    map : self.aMap,
                                    container : document.getElementById("map" + self.mapNumber),
                                    zoom : 14,
                                    center : [-87.620692, 41.888941]
                                });
                                initUI();

                                // grab all the layers and load them
                                console.log("Ready to get alllayers");
                                var allLayers = self.aMap.allLayers,
                                    promises = allLayers.map(function (layer) {
                                        return layer.load();
                                    });
                                return all(promises.toArray());
                            })
                            .then(function (layers) {
                                // each layer load promise resolves with the layer
                                console.log("all " + layers.length + " layers loaded");
                            })
                            .otherwise(function (error) {
                                console.log("otherwise error");
                                console.error(error);
                            });
                            */
                        try {
                            mapDeferred = esri.arcgis.utils.createMap(configOptions.webmap, "map" + self.mapNumber, {
                                mapOptions: {
                                    slider: true,
                                    nav: false,
                                    wrapAround180: true

                                },
                                ignorePopups: false,
                                bingMapsKey: configOptions.bingMapsKey,
                                geometryServiceURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"

                            });
                        } catch (err) {
                            console.log(err.message);
                            alert(err.message);
                        } finally {
                            console.log("finally???????????????");
                            //alert("why are we in finally?");
                        }

                        console.log("set up mapDeferred anonymous method");
                        try {
                            mapDeferred.then(function (response) {
                                console.log("mapDeferred.then");
                                if (previousSelectedWebMapId !== selectedWebMapId) {
                                    previousSelectedWebMapId = selectedWebMapId;
                                    //dojo.destroy(map.container);
                                }
                                if (aMap) {
                                    aMap.destroy();
                                }
                                self.aMap = aMap = response.map;
                                console.log("in mapDeferred anonymous method");
                                console.log("configOptions title " + configOptions.title);
                                console.debug("ItemInfo object " + response.itemInfo);
                                console.log("ItemInfo.item object " + response.itemInfo.item);
                                console.log("response title " + response.itemInfo.item.title);
                                dojo.connect(aMap, "onUpdateStart", showLoading);
                                dojo.connect(aMap, "onUpdateEnd", hideLoading);
                                dojo.connect(aMap, "onLoad", initUI);

                                // self.mapHoster = new MapHosterArcGIS.MapHosterArcGIS();
                                // // self.mapHosterSetupCallback(self.mapHoster, self.aMap);
                                // self.mapHoster.config(self.aMap, zoomWebMap, pointWebMap, self.mlconfig);
                                // $inj = self.mlconfig.getInjector();
                                // mapInstanceSvc = $inj.get('MapInstanceService');
                                // mapInstanceSvc.setMapHosterInstance(self.mapNumber, self.mapHoster);
                                setTimeout(function () {
                                    if (aMap.loaded) {
                                        initUI();
                                    } else {
                                        dojo.connect(aMap, "onLoad", initUI);
                                    }
                                }, 300);
                            }, function (error) {
                                // alert("Create Map Failed ");
                                console.log('Create Map Failed: ' + dojo.toJson(error));
                                console.log("Error: ", error.code, " Message: ", error.message);
                                mapDeferred.cancel();
                            });
                        } catch (err) {
                            console.log("deferred failed with err " + err.message);
                        }
                    },
                    // function getMapHoster() {
                    //     console.log('StartupArcGIS return mapHoster with map no. ' + mapHoster.getMapNumber());
                    //     return mapHoster;
                    // }

                    prepareWindow  (newSelectedWebMapId, referringMph, displayDestination) {

                        var curmph = self.mapHoster,
                            $inj,
                            mapTypeSvc,
                            url,
                            baseUrl,
                            openNewDisplay;

                        openNewDisplay  (channel, userName) {
                            url = "?id=" + newSelectedWebMapId + self.mapHoster.getGlobalsForUrl() +
                                "&channel=" + channel + "&userName=" + userName +
                                "&maphost=ArcGIS" + "&referrerId=" + self.mlconfig.getUserId();
                            if (referringMph) {
                                url = "?id=" + newSelectedWebMapId + referringMph.getGlobalsForUrl() +
                                    "&channel=" + channel + "&userName=" + userName +
                                    "&maphost=ArcGIS" + "&referrerId=" + self.mlconfig.getUserId();
                            }

                            console.log("open new ArcGIS window with URI " + url);
                            console.log("using channel " + channel + "with userName " + userName);
                            self.mlconfig.setUrl(url);
                            PusherConfig.setUserName(userName);
                            self.mlconfig.setUserId(userName + self.mapNumber);
                            if (displayDestination === 'New Pop-up Window') {
                                baseUrl = self.mlconfig.getbaseurl();
                                window.open(baseUrl + "/arcgis/" + url, newSelectedWebMapId, self.mlconfig.getSmallFormDimensions());
                            } else {
                                baseUrl = self.mlconfig.getbaseurl();
                                window.open(baseUrl + "arcgis/" + url, '_blank');
                                window.focus();
                            }
                        };

                        if (PusherConfig.isNameChannelAccepted() === false) {
                            PusherSetupCtrl.setupPusherClient(openNewDisplay,
                                    {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
                        } else {
                            openNewDisplay(PusherConfig.masherChannel(false), PusherConfig.getUserName());
                        }
                    },

                    initialize  (newSelectedWebMapId, destDetails, selectedMapTitle, referringMph) {
                        var displayDestination = destDetails.dstSel;
                        //     $inj,
                        // CurrentMapTypeService;
                        /*
                        This branch should only be encountered after a DestinationSelectorEvent in the AGO group/map search process.
                        The user desires to open a new popup or tab related to the current map view, without yet publishing the new map environment.
                         */
                        if (displayDestination === 'New Pop-up Window') {
                            prepareWindow(newSelectedWebMapId, referringMph, displayDestination);
                        } else if (displayDestination === 'New Tab') {
                            prepareWindow(newSelectedWebMapId, referringMph, displayDestination);
                        } else {
                            /*
                            This branch handles a new ArcGIS Online webmap presentation from either selecting the ArcGIS tab in the master
                            site or opening the webmap from a url sent through a publish event.
                             */

                            initializePostProc(newSelectedWebMapId);

                            // $inj = self.mlconfig.getInjector();
                            // CurrentMapTypeService = $inj.get('CurrentMapTypeService');
                            // CurrentMapTypeService.setCurrentMapType('arcgis');
                        }
                    },

                    initializePreProc  () {

                        console.log('initializePreProc entered');
                        // var urlparams=dojo.queryToObject(window.location.search);
                        // console.debug(urlparams);
                        // var idWebMap=urlparams['?id'];
                        var idWebMap = self.mlconfig.getWebmapId(true),
                            llon,
                            llat;

                        console.debug(idWebMap);
                        // initUI();
                        if (!idWebMap) {
                            console.log("no idWebMap");
                            // selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 "; //"e68ab88371e145198215a792c2d3c794";
                            selectedWebMapId = 'a4bb8a91ecfb4131aa544eddfbc2f1d0'; //'f2e9b762544945f390ca4ac3671cfa72'/
                            self.mlconfig.setWebmapId(selectedWebMapId);
                            console.log("use " + selectedWebMapId);
                            // pointWebMap = [-87.7, lat=41.8];  [-89.381388, 43.07493];
                            pointWebMap = [-87.620692, 41.888941];
                            zoomWebMap = 15;
                            // initialize(selectedWebMapId, '', '');   original from mlhybrid requires space after comma
                            initialize(selectedWebMapId, {dstSel : 'no destination selection probably Same Window'});
                        } else {
                            console.log("found idWebMap");
                            console.log("use " + idWebMap);
                            if (self.mlconfig.hasCoordinates()) {
                                zoomWebMap = self.mlconfig.zoom();
                                llon = self.mlconfig.lon();
                                llat = self.mlconfig.lat();
                                pointWebMap = [llon, llat];
                            }
                            initialize(idWebMap, {dstSel : 'no destination selection probably Same Window'});
                        }
                    };


                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    configure: initializePreProc,
                    replaceWebMap: initialize
                };
            };

        return {
            StartupArcGIS: StartupArcGIS
        };
    });
// }).call(this);
}());
