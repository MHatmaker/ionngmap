import {Injectable, Output, EventEmitter, ElementRef} from '@angular/core';
import { MLConfig } from './MLConfig';
import { PusherConfig } from './PusherConfig';
import { PusherClientService } from '../../../services/pusherclient.service';
import { utils } from './utils';
import { MapHosterArcGIS } from './MapHosterArcGIS';
import { Startup } from './Startup';
import { loadModules } from 'esri-loader';

@Injectable()
export class StartupArcGIS  extends Startup {
    private hostName : string = "MapHosterArcGIS";
    private mapNumber : number = -1;
    private aMap : any = null;
    private aView : any = null;
    private mapHoster : MapHosterArcGIS = null;
    private newSelectedWebMapId : string = '';
    private pusherChannel : string = '';
    private pusher : any = null;
    private mapHosterSetupCallback : any = null;
    private dojoEvent;
    private esriLocator;
    private dojoBaseFx;
    private dojoEasing;
    private esriMap;
    private esriConfig;
    private GeometryService;
    private webmap;
    private mapview;
    private esriPoint;
    private esriSpatialReference;
    private viewCreated;

    constructor (private mapHosterArcGIS : MapHosterArcGIS,
        private mlConfig : MLConfig, private elementRef : ElementRef) {
        super();
        // @Output()
            this.viewCreated = new EventEmitter();
      loadModules(
        ['dojo/_base/event','esri/tasks/locator', 'dojo/_base/fx', 'dojo/fx/easing', 'esri/map', 'esri/config',
            'esri/tasks/GeometryService', 'esri/WebMap', 'esri/MapView', 'esri/geometry/Point', 'esri/geometry/SpatialReference'])
          .then(([dojoEvent, esriLocator, dojoBaseFx, dojoEasing, esriMap, esriConfig,
              GeometrySvc, WebMap, MapView, Point, SpatialReference]) => {
              this.dojoEvent = dojoEvent;
              this.esriLocator = esriLocator;
              this.dojoBaseFx = dojoBaseFx;
              this.dojoEasing = dojoEasing;
              this.esriMap = esriMap;
              this.esriConfig = esriConfig;
              this.GeometryService = GeometrySvc;
              this.webmap = WebMap;
              this.mapview = MapView;
              this.esriPoint = Point;
              this.esriSpatialReference = SpatialReference;
          })
    }

        var
            startupArcGIS (mapNo, mapconfig, mapHosterSetupCallback) {

                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.aMap = null;
                this.aView = null;
                this.mlConfig = mapconfig;
                this.mlConfig.setMapNumber(mapNo);
                this.mlConfig.setUserId(this.pusherConfig.getUserName() + mapNo);
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

                    showLoading = function () {
                        this.utils.showLoading();
                        self.aMap.disableMapNavigation();
                        self.aMap.hideZoomSlider();
                    },

                    hideLoading = function (error) {
                        this.utils.hideLoading(error);
                        self.aMap.enableMapNavigation();
                        self.aMap.showZoomSlider();
                    },
                    placeCustomControls = function () {
                        var $inj = this.mlConfig.getInjector(),
                            ctrlSvc = $inj.get('MapControllerService'),
                            mapCtrl = ctrlSvc.getController();
                            // mapCtrl = MapControllerService.getController();
                        mapCtrl.placeCustomControls();
                    },

                    setupQueryListener = function () {
                        var $inj = this.mlConfig.getInjector(),
                            ctrlSvc = $inj.get('MapControllerService'),
                            mapCtrl = ctrlSvc.getController();
                        // var mapCtrl = MapControllerService.getController();
                        mapCtrl.setupQueryListener();
                    },
                    getMap = function () {
                        return self.aMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance = function (ndx) {
                        return self.mapHoster;
                    },

                    initUI = function () {
                      //add scalebar or other components like a legend, overview map etc
                        // dojo.parser.parse();
                        console.debug(self.aMap);
                        var
                            curmph = null,
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
                            self.mapHoster = new MapHosterArcGIS(self.mapNumber, self.aMap, this.mlconfig, this.elementRef);
                            self.mapHoster.configureMap(self.aMap, zoomWebMap, pointWebMap, this.mlConfig);

                            this.MapInstanceService.setMapHosterInstance(self.mapNumber, self.mapHoster);
                            this.mlConfig.setMapHosterInstance = self.mapHoster;
                            this.CurrentMapTypeService.setCurrentMapType('arcgis');
                            placeCustomControls();
                            setupQueryListener();
                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("StartupArcGIS.initUI : selfDetails.mph as initially null and should now be set");
                            // console.debug(MapHosterArcGIS);
                            // console.debug(pusherChannel);
                            // curmph = self.mapHoster;

                            // $inj = this.mlConfig.getInjector();
                            // console.log("$inj");
                            // console.debug($inj);
                            // mapTypeSvc = $inj.get('CurrentMapTypeService');
                            // curmph = mapTypeSvc.getSelectedMapType();
                            // console.log('selected map type is ' + curmph);

                            self.pusher = this.pusherClientService.createPusherClient(
                                this.mlConfig,
                                function (callbackChannel, userName) {
                                    console.log("callback - don't need to setPusherClient");
                                    console.log("It was a side effect of the createPusherClient:PusherClient process");
                                    this.pusherClientService.setUserName(userName);
                                    // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
                                },
                                {'destination' : "destPlaceHolder", 'currentMapHolder' : self.mapHoster, 'newWindowId' : "windowIdPlaceholder"}
                            );
                            if (!self.pusher) {
                                console.log("failed to create Pusher in StartupGoogle");
                            }

                        } else {
                            console.log("self.mapHoster is something or other");
                            // $inj = this.mlConfig.getInjector();
                            // mapTypeSvc = $inj.get('CurrentMapTypeService');
                            // curmph = mapTypeSvc.getSelectedMapType();
                            // console.log('selected map type is ' + curmph);
                            this.mlConfig.setMapHosterInstance = self.mapHoster;
                            this.pusherChannel = this.pusherConfig.masherChannel(false);
                            pusher = this.pusherClientService.createPusherClient(
                                this.mlConfig,
                                function (callbackChannel, userName) {
                                    console.log("callback - don't need to setPusherClient");
                                    console.log("It was a side effect of the createPusherClient:PusherClient process");
                                    this.usherConfig.setUserName(userName);
                                    // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
                                },
                                {'destination' : "destPlaceHolder", 'currentMapHolder' : curmph, 'newWindowId' : "windowIdPlaceholder"}
                            );
                            currentPusher = pusher;
                            currentChannel = channel;
                            self.mapHoster.configureMap(self.aMap, zoomWebMap, pointWebMap, this.mlconfig);

                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("use current pusher - now setPusherClient");
                            self.mapHoster.setPusherClient(currentPusher, currentChannel);
                            placeCustomControls();  // MOVED TEMPORARILY on 3/15
                            setupQueryListener();
                        }
                    },

                    initializePostProc = function (newSelectedWebMapId) {
                        var
                            mapDeferred,
                            aMap = null,
                            geometrySvc,
                            $inj,
                            webMap = new this.webmap ({
                                portalItem: { // autocasts as new PortalItem()
                                  id: "f2e9b762544945f390ca4ac3671cfa72"
                                }
                            }),
                            viewCreated;


                        //     mapOptions = {},
                        // window.loading = dojo.byId("loadingImg");
                        //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications.
                        // esri.config.defaults.geometryService =
                        geometrySvc = new this.GeometryService('https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');
                        // this.esriConfig.GeometryService =
                        //     new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

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
                            configOptions.webmap = this.webmap.portalItem = newSelectedWebMapId;
                        }

                        console.log('StartupArcGIS ready to instantiate Map Hoster with map no. ' + self.mapNumber);                        // return self.mapHoster;
                        this.esriConfig.request.arcgisUrl = configOptions.sharingurl;                      // return self.mapHoster;
                        // esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
                        this.esriConfig.request.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";
                        // esri.config.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";

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
                                self.mapHoster = new MapHosterArcGIS.MapHosterArcGIS(self.aMap, self.mapNumber, this.mlConfig);
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
                        // try {
                            this.mapView = new this.mapview({
                              container: this.elementRef.nativeElement.firstChild,
                              map: this.webMap, //this.mapService.map,
                              center: new this.esriPoint({
                                x: -87.620692,
                                y: 41.888941,
                                spatialReference: new this.esriSpatialReference({ wkid: 4326 })
                              }),
                              zoom: 15
                            });
                            this.mapView.when(function(){
                                console.log("mapView.when");
                                if (previousSelectedWebMapId !== selectedWebMapId) {
                                    previousSelectedWebMapId = selectedWebMapId;
                                    //dojo.destroy(map.container);
                                }
                                if (aMap) {
                                    aMap.destroy();
                                }
                                self.aMap = aMap = this.webMap;
                                // dojo.connect(aMap, "onUpdateStart", showLoading);
                                // dojo.connect(aMap, "onUpdateEnd", hideLoading);
                                // dojo.connect(aMap, "onLoad", initUI);
                                self.mapHoster = new MapHosterArcGIS(self.aMap, self.mapNumber, this.mlConfig, this.elementRef);
                                self.mapHosterSetupCallback(self.mapHoster, self.aMap);
                            },
                              function(error){

                              });
                            this.viewCreated.next(this.mapView);

                    },
                    // function getMapHoster() {
                    //     console.log('StartupArcGIS return mapHoster with map no. ' + mapHoster.getMapNumber());
                    //     return mapHoster;
                    // }

                    prepareWindow = function (newSelectedWebMapId, referringMph, displayDestination) {

                        var curmph = self.mapHoster,
                            $inj,
                            mapTypeSvc,
                            url,
                            baseUrl,
                            openNewDisplay;

                        openNewDisplay = function (channel, userName) {
                            url = "?id=" + newSelectedWebMapId + self.mapHoster.getGlobalsForUrl() +
                                "&channel=" + channel + "&userName=" + userName +
                                "&maphost=ArcGIS" + "&referrerId=" + this.mlConfig.getUserId();
                            if (referringMph) {
                                url = "?id=" + newSelectedWebMapId + referringMph.getGlobalsForUrl() +
                                    "&channel=" + channel + "&userName=" + userName +
                                    "&maphost=ArcGIS" + "&referrerId=" + this.mlConfig.getUserId();
                            }

                            console.log("open new ArcGIS window with URI " + url);
                            console.log("using channel " + channel + "with userName " + userName);
                            this.mlConfig.setUrl(url);
                            this.pusherConfig.setUserName(userName);
                            this.mlConfig.setUserId(userName + self.mapNumber);
                            if (displayDestination === 'New Pop-up Window') {
                                baseUrl = this.mlConfig.getbaseurl();
                                window.open(baseUrl + "/arcgis/" + url, newSelectedWebMapId, this.mlConfig.getSmallFormDimensions());
                            } else {
                                baseUrl = this.mlConfig.getbaseurl();
                                window.open(baseUrl + "arcgis/" + url, '_blank');
                                window.focus();
                            }
                        };

                        if (this.pusherConfig.isNameChannelAccepted() === false) {
                            this.pusherClientService.setupPusherClient(openNewDisplay,
                                    {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
                        } else {
                            openNewDisplay(this.pusherConfig.masherChannel(false), this.pusherConfig.getUserName());
                        }
                    },

                    initialize = function (newSelectedWebMapId, destDetails, selectedMapTitle, referringMph) {
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

                            // $inj = this.mlConfig.getInjector();
                            // CurrentMapTypeService = $inj.get('CurrentMapTypeService');
                            // CurrentMapTypeService.setCurrentMapType('arcgis');
                        }
                    },

                    initializePreProc = function () {

                        console.log('initializePreProc entered');
                        // var urlparams=dojo.queryToObject(window.location.search);
                        // console.debug(urlparams);
                        // var idWebMap=urlparams['?id'];
                        var idWebMap = this.mlConfig.getWebmapId(true),
                            llon,
                            llat;

                        console.debug(idWebMap);
                        // initUI();
                        if (!idWebMap) {
                            console.log("no idWebMap");
                            // selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 "; //"e68ab88371e145198215a792c2d3c794";
                            selectedWebMapId = 'a4bb8a91ecfb4131aa544eddfbc2f1d0'; //'f2e9b762544945f390ca4ac3671cfa72'/
                            this.mlConfig.setWebmapId(selectedWebMapId);
                            console.log("use " + selectedWebMapId);
                            // pointWebMap = [-87.7, lat=41.8];  [-89.381388, 43.07493];
                            pointWebMap = [-87.620692, 41.888941];
                            zoomWebMap = 15;
                            // initialize(selectedWebMapId, '', '');   original from mlhybrid requires space after comma
                            initialize(selectedWebMapId, {dstSel : 'no destination selection probably Same Window'},
                                'Name Placeholder', null);
                        } else {
                            console.log("found idWebMap");
                            console.log("use " + idWebMap);
                            if (this.mlConfig.hasCoordinates()) {
                                zoomWebMap = this.mlConfig.zoom();
                                llon = this.mlConfig.lon();
                                llat = this.mlConfig.lat();
                                pointWebMap = [llon, llat];
                            }
                            initialize(idWebMap, {dstSel : 'no destination selection probably Same Window'},
                                'Name Placeholder', null);
                        }
                    };
                  }
}
