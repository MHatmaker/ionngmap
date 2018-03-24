import {Injectable, Output, EventEmitter, ElementRef} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
// import { utils } from './utils';
import { Startup } from './Startup';
import { MapHosterArcGIS } from './MapHosterArcGIS';
import { loadModules } from 'esri-loader';
import { GeoPusherSupport } from './geopushersupport';

interface ConfigOptions {
    // webmap: '4b99c1fb712d4fe694805717df5fadf2', // selectedWebMapId,
    webmap: string,
    title: string,
    subtitle: string,
    //arcgis.com sharing url is used modify this if yours is different
    sharingurl: string,
    //enter the bing maps key for your organization if you want to display bing maps
    bingMapsKey: string
  }

// @Injectable()
export class StartupArcGIS  extends Startup {
    // private hostName : string = "MapHosterArcGIS";
    private aMap : any = null;
    private configOptions  : ConfigOptions;
    private aView : any = null;
    private mapHoster : MapHosterArcGIS = null;
    // private newSelectedWebMapId : string = '';
    // private pusherChannel : string = '';
    selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0"; // Requires a space after map ID
    private pusher : any = null;
    private pusherChannel = null;
    private channel = null;
    private mapHosterSetupCallback : any = null;
    private dojoEvent;
    private esriLocator;
    private dojoBaseFx;
    private dojoEasing;
    private esriMap;
    private esriConfig;
    private GeometryService;
    private esriwebmap;
    private esrimapview;
    private esriPoint;
    private esriSpatialReference;
    private viewCreated;
    private pointWebMap = [null, null];
    private zoomWebMap = null;
    private mapView : any = null;
    private mlconfig : MLConfig;

    constructor (private mapNumber : number, mlconfig : MLConfig, private elementRef : ElementRef,
        private geopush: GeoPusherSupport) {
        super(geopush);
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
              this.esriwebmap = WebMap;
              this.esrimapview = MapView;
              this.esriPoint = Point;
              this.esriSpatialReference = SpatialReference;
          });
        this.mlconfig = mlconfig;
        this.mlconfig.setMapNumber(mapNumber);
        this.mlconfig.setUserId(this.geopush.getGeoPusherSupport().pusherConfig.getUserName() + mapNumber);
    }

  configure  (newMapId, mapLocOpts) {
      var
          selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0", // Requires a space after map ID
          previousSelectedWebMapId = selectedWebMapId,
          channel = null,
          pusher = null,

          configOptions;
  }

  showLoading () {
      this.geopush.getGeoPusherSupport().utils.showLoading();
      this.aMap.disableMapNavigation();
      this.aMap.hideZoomSlider();
  }

  hideLoading (error) {
      this.geopush.getGeoPusherSupport().utils.hideLoading(error);
      this.aMap.enableMapNavigation();
      this.aMap.showZoomSlider();
  }
  placeCustomControls () {
      var $inj = this.mlconfig.getInjector(),
          ctrlSvc = $inj.get('MapControllerService'),
          mapCtrl = ctrlSvc.getController();
          // mapCtrl = MapControllerService.getController();
      mapCtrl.placeCustomControls();
  }

  setupQueryListener () {
      var $inj = this.mlconfig.getInjector(),
          ctrlSvc = $inj.get('MapControllerService'),
          mapCtrl = ctrlSvc.getController();
      // var mapCtrl = MapControllerService.getController();
      mapCtrl.setupQueryListener();
  }
  getMap () {
      return this.aMap;
  }

  getMapNumber () {
      return this.mapNumber;
  }
  getMapHosterInstance (ndx) {
      return this.mapHoster;
  }

  initUI () {
    //add scalebar or other components like a legend, overview map etc
      // dojo.parser.parse();
      console.debug(this.aMap);
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

      console.log("start MapHoster with center " + this.pointWebMap[0] + ", " + this.pointWebMap[1] + ' zoom ' + this.zoomWebMap);
      console.log("this.mapHoster : " + this.mapHoster);
      if (this.mapHoster === null) {
          console.log("this.mapHoster is null");
          // alert("StartupArcGIS.initUI : thisDetails.mph == null");
          // placeCustomControls();
          this.mapHoster = new MapHosterArcGIS(this.mapNumber, this.aMap, this.mlconfig, this.geopush, this.elementRef);
          this.mapHoster.configureMap(this.aMap, this.zoomWebMap, this.pointWebMap, this.mlconfig);

          this.geopush.getGeoPusherSupport().mapInstanceService.setMapHosterInstance(this.mapNumber, this.mapHoster);
          this.mlconfig.setMapHosterInstance(this.mapHoster);
          this.geopush.getGeoPusherSupport().currentMapTypeService.setCurrentMapType('arcgis');
          this.placeCustomControls();
          this.setupQueryListener();
          // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
          console.log("StartupArcGIS.initUI : thisDetails.mph as initially null and should now be set");
          // console.debug(MapHosterArcGIS);
          // console.debug(pusherChannel);
          // curmph = this.mapHoster;

          // $inj = this.mlconfig.getInjector();
          // console.log("$inj");
          // console.debug($inj);
          // mapTypeSvc = $inj.get('CurrentMapTypeService');
          // curmph = mapTypeSvc.getSelectedMapType();
          // console.log('selected map type is ' + curmph);

          this.pusher = this.geopush.getGeoPusherSupport().pusherClientService.createPusherClient(
              this.mlconfig,
              function (callbackChannel, userName) {
                  console.log("callback - don't need to setPusherClient");
                  console.log("It was a side effect of the createPusherClient:PusherClient process");
                  this.pusherClientService.setUserName(userName);
                  // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
              },
              {'destination' : "destPlaceHolder", 'currentMapHolder' : this.mapHoster, 'newWindowId' : "windowIdPlaceholder"}
          );
          if (!this.pusher) {
              console.log("failed to create Pusher in StartupGoogle");
          }

      } else {
          console.log("this.mapHoster is something or other");
          // $inj = this.mlconfig.getInjector();
          // mapTypeSvc = $inj.get('CurrentMapTypeService');
          // curmph = mapTypeSvc.getSelectedMapType();
          // console.log('selected map type is ' + curmph);
          this.mlconfig.setMapHosterInstance(this.mapHoster);
          this.pusherChannel = this.geopush.getGeoPusherSupport().pusherConfig.masherChannel(false);
          this.pusher = this.geopush.getGeoPusherSupport().pusherClientService.createPusherClient(
              this.mlconfig,
              function (callbackChannel, userName) {
                  console.log("callback - don't need to setPusherClient");
                  console.log("It was a side effect of the createPusherClient:PusherClient process");
                  this.usherConfig.setUserName(userName);
                  // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
              },
              {'destination' : "destPlaceHolder", 'currentMapHolder' : curmph, 'newWindowId' : "windowIdPlaceholder"}
          );
          currentPusher = this.pusher;
          currentChannel = this.channel;
          this.mapHoster.configureMap(this.aMap, this.zoomWebMap, this.pointWebMap, this.mlconfig);

          // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
          console.log("use current pusher - now setPusherClient");
          this.mapHoster.setPusherClient(currentPusher, currentChannel);
          this.placeCustomControls();  // MOVED TEMPORARILY on 3/15
          this.setupQueryListener();
      }
  }

  initializePostProc (newSelectedWebMapId) {
      var
          mapDeferred,
          aMap = null,
          geometrySvc,
          webMap = new this.esriwebmap ({
              portalItem: { // autocasts as new PortalItem()
                id: "f2e9b762544945f390ca4ac3671cfa72"
              }
          });
          // viewCreated;


      //     mapOptions = {},
      // window.loading = dojo.byId("loadingImg");
      //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications.
      // esri.config.defaults.geometryService =
      geometrySvc = new this.GeometryService('https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');
      // this.esriConfig.GeometryService =
      //     new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

      console.log("StartupArcGIS configure with map no. " + this.mapNumber);
      console.log("configOptions.webmap will be " + this.selectedWebMapId);
      //specify any default settings for your map
      //for example a bing maps key or a default web map id
      this.configOptions  =  {
          // webmap: '4b99c1fb712d4fe694805717df5fadf2', // selectedWebMapId,
          webmap: this.selectedWebMapId,
          title: "",
          subtitle: "",
          //arcgis.com sharing url is used modify this if yours is different
          sharingurl: "http://arcgis.com/sharing/content/items",
          //enter the bing maps key for your organization if you want to display bing maps
          bingMapsKey: "/*Please enter your own Bing Map key*/"
      };
      if(newSelectedWebMapId){
          this.configOptions.webmap = this.esriwebmap.portalItem = newSelectedWebMapId;
      }

      console.log('StartupArcGIS ready to instantiate Map Hoster with map no. ' + this.mapNumber);                        // return this.mapHoster;
      this.esriConfig.request.arcgisUrl = this.configOptions.sharingurl;                      // return this.mapHoster;
      // esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
      this.esriConfig.request.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";
      // esri.config.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";

      //create the map using the web map id specified using configOptions or via the url parameter
      // var cpn = new dijit.layout.ContentPane({}, "map_canvas").startup();

      // dijit.byId("map_canvas").addChild(cpn).placeAt("map_canvas").startup();
      console.log("call for new WebMap with webmap id " + this.configOptions.webmap);

      // this.aMap = new WebMap({portalItem : {id: configOptions.webmap}});
      // this.aMap = new WebMap({portalItem : {id: 'e691172598f04ea8881cd2a4adaa45ba'}});

      // this.aMap = new WebMap({portalItem : {id: 'a4bb8a91ecfb4131aa544eddfbc2f1d0'}});
      // this.aView = new MapView({
      //     map : this.aMap,
      //     container : document.getElementById("map" + this.mapNumber),
      //     zoom : 14,
      //     center : [-87.620692, 41.888941]
      // });
      // initUI();
      /*
      this.aMap.load()
          .then(function () {
            // load the basemap to get its layers created
            console.log('map.then callback function');
              return this.aMap.basemap.load();
          })
          .then(function () {

              if (previousSelectedWebMapId !== selectedWebMapId) {
                  previousSelectedWebMapId = selectedWebMapId;
                  //dojo.destroy(map.container);
              }
              this.mapHoster = new MapHosterArcGIS.MapHosterArcGIS(this.aMap, this.mapNumber, this.mlconfig);
              this.mapHosterSetupCallback(this.mapHoster, this.aMap);
              this.aView = new MapView({
                  map : this.aMap,
                  container : document.getElementById("map" + this.mapNumber),
                  zoom : 14,
                  center : [-87.620692, 41.888941]
              });
              initUI();

              // grab all the layers and load them
              console.log("Ready to get alllayers");
              var allLayers = this.aMap.allLayers,
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
          this.mapView = new this.esrimapview({
            container: this.elementRef.nativeElement.firstChild,
            map: this.esriwebmap, //this.mapService.map,
            center: new this.esriPoint({
              x: -87.620692,
              y: 41.888941,
              spatialReference: new this.esriSpatialReference({ wkid: 4326 })
            }),
            zoom: 15
          });
          this.mapView.when(function(){
              console.log("mapView.when");
              if (this.previousSelectedWebMapId !== this.selectedWebMapId) {
                  this.previousSelectedWebMapId = this.selectedWebMapId;
                  //dojo.destroy(map.container);
              }
              if (aMap) {
                  aMap.destroy();
              }
              this.aMap = aMap = this.webMap;
              // dojo.connect(aMap, "onUpdateStart", showLoading);
              // dojo.connect(aMap, "onUpdateEnd", hideLoading);
              // dojo.connect(aMap, "onLoad", initUI);
              this.mapHoster = new MapHosterArcGIS(this.aMap, this.mapNumber, this.mlconfig, this.geopush, this.elementRef);
              this.mapHosterSetupCallback(this.mapHoster, this.aMap);
          },
            function(error){

            });
          this.viewCreated.next(this.mapView);

  }
  // function getMapHoster() {
  //     console.log('StartupArcGIS return mapHoster with map no. ' + mapHoster.getMapNumber());
  //     return mapHoster;
  // }

  prepareWindow (newSelectedWebMapId, referringMph, displayDestination) {

      var curmph = this.mapHoster,
          url,
          baseUrl,
          openNewDisplay;

      openNewDisplay = function (channel, userName) {
          url = "?id=" + newSelectedWebMapId + this.mapHoster.getGlobalsForUrl() +
              "&channel=" + channel + "&userName=" + userName +
              "&maphost=ArcGIS" + "&referrerId=" + this.mlconfig.getUserId();
          if (referringMph) {
              url = "?id=" + newSelectedWebMapId + referringMph.getGlobalsForUrl() +
                  "&channel=" + channel + "&userName=" + userName +
                  "&maphost=ArcGIS" + "&referrerId=" + this.mlconfig.getUserId();
          }

          console.log("open new ArcGIS window with URI " + url);
          console.log("using channel " + channel + "with userName " + userName);
          this.mlconfig.setUrl(url);
          this.pusherConfig.setUserName(userName);
          this.mlconfig.setUserId(userName + this.mapNumber);
          if (displayDestination === 'New Pop-up Window') {
              baseUrl = this.mlconfig.getbaseurl();
              window.open(baseUrl + "/arcgis/" + url, newSelectedWebMapId, this.mlconfig.getSmallFormDimensions());
          } else {
              baseUrl = this.mlconfig.getbaseurl();
              window.open(baseUrl + "arcgis/" + url, '_blank');
              window.focus();
          }
      };

      if (this.geopush.getGeoPusherSupport().pusherConfig.isNameChannelAccepted() === false) {
          this.geopush.getGeoPusherSupport().pusherClientService.setupPusherClient(openNewDisplay,
                  {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
      } else {
          openNewDisplay(this.geopush.getGeoPusherSupport().pusherConfig.masherChannel(false),
              this.geopush.getGeoPusherSupport().pusherConfig.getUserName());
      }
  }

  initialize (newSelectedWebMapId, destDetails, selectedMapTitle, referringMph) {
      var displayDestination = destDetails.dstSel;
      //     $inj,
      // CurrentMapTypeService;
      /*
      This branch should only be encountered after a DestinationSelectorEvent in the AGO group/map search process.
      The user desires to open a new popup or tab related to the current map view, without yet publishing the new map environment.
       */
      if (displayDestination === 'New Pop-up Window') {
          this.prepareWindow(newSelectedWebMapId, referringMph, displayDestination);
      } else if (displayDestination === 'New Tab') {
          this.prepareWindow(newSelectedWebMapId, referringMph, displayDestination);
      } else {
          /*
          This branch handles a new ArcGIS Online webmap presentation from either selecting the ArcGIS tab in the master
          site or opening the webmap from a url sent through a publish event.
           */

          this.initializePostProc(newSelectedWebMapId);

          // $inj = this.mlconfig.getInjector();
          // CurrentMapTypeService = $inj.get('CurrentMapTypeService');
          // CurrentMapTypeService.setCurrentMapType('arcgis');
      }
  }

  initializePreProc () {

      console.log('initializePreProc entered');
      // var urlparams=dojo.queryToObject(window.location.search);
      // console.debug(urlparams);
      // var idWebMap=urlparams['?id'];
      var idWebMap = this.mlconfig.getWebmapId(true),
          llon,
          llat;

      console.debug(idWebMap);
      // initUI();
      if (!idWebMap) {
          console.log("no idWebMap");
          // selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 "; //"e68ab88371e145198215a792c2d3c794";
          this.selectedWebMapId = 'a4bb8a91ecfb4131aa544eddfbc2f1d0'; //'f2e9b762544945f390ca4ac3671cfa72'/
          this.mlconfig.setWebmapId(this.selectedWebMapId);
          console.log("use " + this.selectedWebMapId);
          // pointWebMap = [-87.7, lat=41.8];  [-89.381388, 43.07493];
          this.pointWebMap = [-87.620692, 41.888941];
          this.zoomWebMap = 15;
          // initialize(selectedWebMapId, '', '');   original from mlhybrid requires space after comma
          this.initialize(this.selectedWebMapId, {dstSel : 'no destination selection probably Same Window'},
              'Name Placeholder', null);
      } else {
          console.log("found idWebMap");
          console.log("use " + idWebMap);
          if (this.mlconfig.hasCoordinates()) {
              this.zoomWebMap = this.mlconfig.zoom();
              llon = this.mlconfig.lon();
              llat = this.mlconfig.lat();
              this.pointWebMap = [llon, llat];
          }
          this.initialize(idWebMap, {dstSel : 'no destination selection probably Same Window'},
              'Name Placeholder', null);
      }
  };
}
