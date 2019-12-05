import {Injectable, OnInit, ElementRef} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
import { utils } from './utils';
// import { ConfigParams } from '../../../services/configparams.service';
// import { GeoCoder } from './GeoCoder';
// import { IPositionParams, IPositionData } from '../../../services/positionupdate.interface';
// import { PositionUpdateService } from '../../../services/positionupdate.service';
import { PusherEventHandler } from './PusherEventHandler';
import { loadModules } from 'esri-loader';
// import { ImlBounds } from '../../../services/mlbounds.service'
// import { SpatialReference } from 'esri/geometry';
// import { Point } from 'esri/geometry';
import * as proj4x from 'proj4';
// import { toScreenGeometry } from 'esri/geometry/screenUtils';
// import { webMercatorToGeographic, xyToLngLat, lngLatToXY } from 'esri/geometry/support/webMercatorUtils';
// import * as Locator from 'esri/tasks/Locator';
import { MapHoster } from './MapHoster';
import {GeoPusherSupport, IGeoPusher } from '../libs/geopushersupport';
import { ImlBounds, MLBounds, xtntParams } from '../../../services/mlbounds.service';
import { DomService } from '../../../services/dom.service';
import { ReflectiveInjector } from '@angular/core';
import { MapLocOptions } from '../../../services/positionupdate.interface';
import { AppModule } from '../../../app/app.module';

const proj4 = (proj4x as any).default;

// @Injectable()
export class MapHosterArcGIS extends MapHoster implements OnInit {
    hostName = "MapHosterArcGIS";
    scale2Level = [];
    zmG = -1;
    userZoom = true;
    self : any;
    // this.mphmapCenter;
    cntrxG = null;
    cntryG = null;
    bounds : ImlBounds = null;
    minZoom = null;
    maxZoom = null;
    zoomLevels = null;
    mapReady = true;
    popup = null;
    marker = null;
    markers = [];
    popups = [];
    mrkr = null;
    CustomControl = null;
    queryListenerLoaded = false;

    selectedMarkerId = 101;
    initialActionListHtml = '';
    geoLocator : __esri.Locator;
    screenPt = null;
    fixedLLG = null;
    // btnShare;
    selfPusherDetails = {
        channel : null,
        pusher : null
    };
    mlconfig : MLConfig;
    geopushSup : IGeoPusher;
    pusherEventHandler: PusherEventHandler;
    utils : any;

    agoOptions
        options = {
        url: 'agourl'
      };
    // require(['dojo/_base/event','esri/tasks/locator', 'dojo/_base/fx', 'dojo/fx/easing', 'esri/map']);
    //
    // define([
    //     'controllers/PositionViewCtrl',
    //     'libs/utils',
    //     'libs/this.mlconfig',
    //     'libs/PusherEventHandler',
    //     'controllers/PusherSetupCtrl',
    //     'libs/PusherConfig',
    //     'esri/geometry/Point',
    //     'dojo/_base/event'
    // ],

    constructor(private mphmap : __esri.MapView, private mapNumber: number,  mlconfig: MLConfig, protected geopush: GeoPusherSupport,
        private elementRef : ElementRef) {
        super(geopush);
        this.mlconfig = mlconfig;
        this.geopushSup = geopush.getGeoPusherSupport();
        let pos = this.mlconfig.getPosition();
        this.cntrxG = pos.lon;
        this.cntryG = pos.lat;
        this.zmG = pos.zoom;
        this.utils = AppModule.injector.get(utils);
    }

    async initializeMap() {
      try {
        const [esriPoint, esriSpatialReference, esriWebMercator, esriGeometry, Locator,
              esriwebMercatorUtils, esriMapView] = await loadModules([
            'esri/geometry/Point', 'esri/geometry/SpatialReference', 'esri/geometry/WebMercator',
            'esri/geometry/Geometry', 'esri/tasks/Locator', 'esri/geometry/support/webMercatorUtils',
            'esri/views/MapView'
          ], this.agoOptions)
      }
      catch(error) {
        console.log('We have an error: ' + error);
      }
    }
    ngOnInit () {
      this.initializeMap();
      this.self = this;
      /*
        loadModules([
            'esri/geometry/Point', 'esri/geometry/SpatialReference', 'esri/geometry/WebMercator',
            'esri/geometry/Geometry', 'esri/tasks/Locator', 'esri/geometry/support/webMercatorUtils',
            'esri/views/MapView'
          ]).then(([Point, SpatialReference, WebMercator, Geometry, Locator,
              webMercatorUtils, MapView]) => {
                  this.esriMapView = MapView;
                  this.esriwebMercatorUtils = webMercatorUtils;
                  this.esriSpatialRef = SpatialReference;
                  this.esriWebMercator = WebMercator;
                  this.esriPoint = Point;
                  this.esriGeometry = Geometry;
                  this.esriLocator = Locator;
              });
              */
    }
    getMap() {
        return this.mphmap;
    }

    getMapNumber() {
        return this.mapNumber;
    }
    //     getMapHosterInstance (ndx) {
    //     return this.mphmap;
    // }

    async updateGlobals(msg, cntrx, cntry, zm) {
        const [esriwebMercatorUtils] = await loadModules([
             'esri/geometry/support/webMercatorUtils'
          ], this.agoOptions);
        console.log("updateGlobals ");
        this.zmG = zm;
        this.cntrxG = cntrx;
        this.cntryG = cntry;
        if (this.mphmap !== null) {
            let ll = esriwebMercatorUtils.xyToLngLat(this.mphmap.extent.xmin, this.mphmap.extent.ymin);
            let ur = esriwebMercatorUtils.xyToLngLat(this.mphmap.extent.xmax, this.mphmap.extent.ymax);
            this.bounds = new MLBounds(ll[0], ll[1], ur[0], ur[1]);
            // this.bounds = this.mphmap.extent;
            this.mlconfig.setBounds(this.bounds);
            // this.mlconfig.setBounds({'llx' : this.bounds.xmin, 'lly' : this.bounds.ymin, 'urx' : this.bounds.xmax, 'ury' : this.bounds.ymax});
        }
        console.log("Updated Globals " + msg + " " + this.cntrxG + ", " + this.cntryG + " : " + this.zmG);
        this.geopushSup.positionUpdateService.positionData.emit(
            {'key' : 'zm',
              'val' : {
                'zm' : this.zmG,
                'scl' : this.scale2Level.length > 0 ? this.scale2Level[this.zmG].scale : 3,
                'cntrlng' : this.cntrxG,
                'cntrlat': this.cntryG,
                'evlng' : this.cntrxG,
                'evlat' : this.cntryG
          }
        });
        this.mlconfig.setPosition({'lon' : this.cntrxG, 'lat' : this.cntryG, 'zoom' : this.zmG});
    }

    showGlobals(cntxt) {
        console.log(cntxt + " Globals : lon " + this.cntrxG + " lat " + this.cntryG + " zoom " + this.zmG);
    }

    initMap(value) {
        /*jslint nomen: true */  // for dangling _
        // var tileInfo = this.mphmap.__tileInfo,
        //     lods = tileInfo.lods,
        var lods : any[] = [], //this.mphmap.lods,
            sc2lv;
        lods = this.mphmap.constraints.effectiveLODs;
        if(lods) {
          this.zoomLevels = lods.length;
          this.scale2Level = [];
          sc2lv = this.scale2Level;
          for( let item of lods) {
              var obj = {"scale" : item.scale, "resolution" : item.resolution, "level" : item.level};
              sc2lv.push(obj);
              // console.log("scale " + obj.scale + " level " + obj.level + " resolution " + obj.resolution);
          };
        }
        console.log("zoom levels : " + this.zoomLevels);
    }

    async extractBounds(zm, cntr, action) : Promise<xtntParams> {
        const [esriPoint, esriSpatialReference] = await loadModules([
            'esri/geometry/Point', 'esri/geometry/SpatialReference',
          ], this.agoOptions)
        var source = proj4.Proj('GOOGLE'),
            dest = proj4.Proj('WGS84'),
            p = proj4.toPoint([cntr.longitude, cntr.latitude]),
            cntrpt,
            fixedLL;
/*
        console.log("proj4.transform " + p.x + ", " + p.y);
        try {
            proj4.transform(source, dest, p);
        } catch (err) {
            alert("proj4.transform threw up");
        }
        console.log("ready to create ESRI pt with " + p.x + ", " + p.y);
*/
        cntrpt = new esriPoint({longitude : cntr.longitude, latitude : cntr.latitude, spatialReference : new esriSpatialReference({wkid: 4326})});
        // cntrpt = new esriPoint({longitude : cntr.x, latitude : cntr.y, spatialReference : new esriSpatialReference({wkid: 4326})});
        console.log("cntr " + cntr.x + ", " + cntr.y);
        console.log("cntrpt " + cntrpt.x + ", " + cntrpt.y);
        // let ltln = esriwebMercatorUtils.geographicToWebMercator(cntrpt);
        // fixedLL = this.utils.toFixedTwo(ltln.longitude, ltln.latitude, 3);
        fixedLL = this.utils.toFixedTwo(cntrpt.x, cntrpt.y, 9);
        return {
            'src' : 'arcgis',
            'zoom' : zm,
            'lon' : fixedLL.lon,
            'lat' : fixedLL.lat,
            'scale': this.scale2Level[zm].scale,
            'action': action
        };
    }

    compareExtents(msg, xtnt) {
        var cmp = xtnt.zoom === this.zmG,
            wdth = Math.abs(this.bounds.urx - this.bounds.llx),
            hgt = Math.abs(this.bounds.ury - this.bounds.lly),
            lonDif = Math.abs((xtnt.lon - this.cntrxG) / wdth),
            latDif =  Math.abs((xtnt.lat - this.cntryG) / hgt);
        // cmp = ((cmp == true) && (xtnt.lon == this.cntrxG) && (xtnt.lat == this.cntryG));
        cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
        console.log("compareExtents " + msg + " " + cmp);
        return cmp;
    }

    async setBounds(xtExt) {
        console.log("MapHosterArcGIS setBounds with selfPusherDetails.pusher " + this.mlconfig.getMapNumber());
        var xtntJsonStr,
            cmp;
        if (this.mapReady === true) { //} && selfPusherDetails.pusher) { // && self.pusher.ready == true) {
            // runs this code after you finishing the zoom
            console.log("MapHoster ArcGIS " + this.mlconfig.getMapNumber() + " setBounds ready to process json xtExt");
            xtntJsonStr = JSON.stringify(xtExt);
            console.log("extracted bounds " + xtntJsonStr);
            cmp = this.compareExtents("setBounds", xtExt);
            if (cmp === false) {
                console.log("MapHoster arcGIS " + this.mlconfig.getMapNumber() + " setBounds pusher send ");
                //
                // if (selfPusherDetails.pusher && selfPusherDetails.channelName) {
                //     selfPusherDetails.pusher.channel(selfPusherDetails.channelName).trigger('client-MapXtntEvent', xtExt);
                // }
                this.geopushSup.pusherClientService.publishPanEvent(xtExt);
                await this.updateGlobals("in setBounds with cmp false", xtExt.lon, xtExt.lat, xtExt.zoom);
                //console.debug(sendRet);
            }
        }
    }

    setUserName(name) {
        this.geopushSup.pusherConfig.setUserName(name);
    }
    getEventDictionary() {
        var eventDct = this.pusherEventHandler.getEventDct();
        return eventDct;
    }

    setPusherClient(pusher, channel) {
        console.log("MapHosterArcGIS setPusherClient " +  this.pusherEventHandler.getMapNumber());
        /*
        var evtDct = this.pusherEventHandler.getEventDct(),
            key;

        console.log("Ready to subscribe MapHosterArcGIS " + this.mlconfig.getMapNumber());
        if (selfPusherDetails.pusher === null) {
            selfPusherDetails.pusher = pusher;
            selfPusherDetails.channelName = channel;
            this.pusherConfig.setChannel(channel);

            for (key in evtDct) {
                if (evtDct.hasOwnProperty(key)) {
                    pusher.subscribe(key, evtDct[key]);
                }
            }

            // pusher.subscribe( 'client-MapXtntEvent', retrievedBounds);
            // pusher.subscribe( 'client-MapClickEvent', retrievedClick);
            // pusher.subscribe( 'client-NewMapPosition', retrievedNewPosition);
            console.log("reset MapHosterArcGIS setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
        }
        */
    }

    async retrievedClick(clickPt) {
      if (clickPt.referrerId !== this.mlconfig.getUserId()) {
        const [esriPoint, esriMapView] = await loadModules([
              'esri/geometry/Point', 'esri/views/MapView'
            ], this.agoOptions)
          console.log("Back in retrievedClick");
          // var latlng = L.latLng(clickPt.y, clickPt.x, clickPt.y);
          console.log("You clicked the map at " + clickPt.x + ", " + clickPt.y);
          // alert("You clicked the map at " + clickPt.x + ", " + clickPt.y);
          console.debug(clickPt);
          var
              // mpDiv = document.getElementById("map" + this.mlconfig.getMapNumber()),
              // mpDivNG = angular.element(mpDiv),
              mpDivNG = this.elementRef,
              // wdt = mpDivNG[0].clientWidth,
              // hgt = mpDivNG[0].clientHeight,
              mppt = new esriPoint({longitude : clickPt.x, latitude : clickPt.y}),
              // screenGeo = new toScreenGeometry(this.mphmap.extent, wdt, hgt, mppt),
              screenGeo = this.mphmap.toScreen(mppt),
              fixedLL,
              content,
              $inj,
              linkrSvc;

          // console.log("screenGeo");
          // console.debug(screenGeo);
          // $inj = this.mlconfig.getInjector();
          // linkrSvc = $inj.get('LinkrService');
          // linkrSvc.hideLinkr();

          //      screengraphic = new esri.geometry.toScreenGeometry(this.mphmap.extent,800,600,userdrawlayer.graphics[0].geometry);

          // if (clickPt.referrerId !== this.mlconfig.getUserId()) {
              fixedLL = this.utils.toFixedTwo(clickPt.x, clickPt.y, 9);
              content = "Map click at " + fixedLL.lat + ", " + fixedLL.lon;
              if (clickPt.title) {
                  content += '<br>' + clickPt.title;
              }
              if (clickPt.address) {
                  content += '<br>' + clickPt.address;
              }
              this.mphmap.popup.title = "Received from user " + clickPt.referrerName + ", " + clickPt.referrerId;
              this.mphmap.popup.content = content;
          // }

          this.mphmap.popup.open({location : mppt}); // this.mphmap.getInfoWindowAnchor(screenGeo));
          // popup
              // .setLatLng(latlng)
              // .setContent("You clicked the map at " + latlng.toString())
              // .openOn(this.mphmap);
      }
    }
    async retrievedBounds(xj) {
      const [esriPoint, esriSpatialReference, esriwebMercatorUtils] = await loadModules([
            'esri/geometry/Point', 'esri/geometry/SpatialReference', 'esri/geometry/support/webMercatorUtils'
          ], this.agoOptions)
        console.log("Back in MapHosterArcGIS " + this.mlconfig.getMapNumber() + " retrievedBounds");
        if (xj.zoom === '0') {
            xj.zoom = this.zmG;
        }
        var zm = xj.zoom,
            // x = esriwebMercatorUtils.lngLatToXY(xj.lon, xj.lat),
            cmp = this.compareExtents("retrievedBounds",
                {
                    'zoom' : xj.zoom,
                    'lon' : xj.lon, //x[0],
                    'lat' : xj.lat  //x[1]
                }),
            view = xj.lon + ", " + xj.lat + " : " + zm + " " + this.scale2Level[zm].scale,
            tmpLon,
            tmpLat,
            tmpZm,
            cntr;

        if (document.getElementById("mppos") !== null) {
            let elementVal = document.getElementById("mppos") as HTMLTextAreaElement;
            elementVal.innerHTML = view;
        }
        if (cmp === false) {
            tmpLon = this.cntrxG;
            tmpLat = this.cntryG;
            tmpZm = this.zmG;

            await this.updateGlobals("in retrievedBounds with cmp false", xj.lon, xj.lat, xj.zoom);
            // this.userZoom = false;
            console.log("retrievedBounds centerAndZoom at zm = " + zm);
            cntr = new esriPoint({longitude : xj.lon, latitude : xj.lat, spatialReference : new esriSpatialReference({wkid: 4326})});

            this.userZoom = false;
            if (xj.action === 'pan') {
                if (tmpZm !== zm) {
                    // this.mphmap.centerAndZoom(cntr, zm);
                    this.mphmap.goTo({target : cntr, zoom : zm});
                } else {
                    // this.mphmap.centerAt(cntr);
                    this.mphmap.goTo(cntr);
                }
            } else {
                if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                    // var tmpCenter = new GeometryPoint(tmpLon, tmpLat, new esri.SpatialReference({wkid: 4326}));
                    // this.mphmap.centerAndZoom(cntr, zm);
                    this.mphmap.goTo({target : cntr, zoom : zm});
                } else {
                    this.mphmap.zoom = zm;
                }
            }
            this.userZoom = true;
        }
    }

    async onMapClick(e) {
      try {
      const [esriPoint, esriSpatialReference, esriwebMercatorUtils] = await loadModules([
            'esri/geometry/Point', 'esri/geometry/SpatialReference', 'esri/geometry/support/webMercatorUtils'
          ], this.agoOptions)
        var mapPt = {x : e.mapPoint.x, y : e.mapPoint.y},
            source = proj4.Proj('GOOGLE'),
            dest =  proj4.Proj('WGS84'),
            p,
            cntrpt;
        // this.screenPt = e.mapPoint;
        // console.log("e.screenPoint");
        // console.debug(e.screenPoint);
        // p = proj4.toPoint([e.mapPoint.x, e.mapPoint.y]);
        // proj4.transform(source, dest, p);
        // cntrpt = new esriPoint({longitude : p.x, latitude : p.y, spatialReference : new esriSpatialReference({wkid: 4326})});
        // console.log("clicked Pt " + mapPt.x + ", " + mapPt.y);
        // console.log("converted Pt " + cntrpt.x + ", " + cntrpt.y);
        this.fixedLLG = this.utils.toFixedTwo(e.mapPoint.longitude , e.mapPoint.latitude, 9);
        // let locPt = esriwebMercatorUtils.xyToLngLat(e.mapPoint.longitude, e.mapPoint.latitude);
        // let locPt2 = new esriPoint({longitude: locPt[0], latitude: locPt[1], spatialReference : new esriSpatialReference({wkid: 4326})});
        this.geoLocator.locationToAddress(e.mapPoint)
        .then((response) => {
            // var location;
            if (response.address) {
                let address = response.address;
                let location = esriwebMercatorUtils.lngLatToXY(response.location.longitude, response.location.latitude);
                this.showClickResult(address, e.mapPoint);
                console.debug(location);
            } else {
                this.showClickResult(null, e.mapPoint);
            }

        }).otherwise(function(err) {
          console.log(err);
        });

     /*
        // this.mphmap.infoWindow.setTitle("Coordinates");
        // this.mphmap.infoWindow.setContent("lat/lon : " + fixedLL.lat + ", " + fixedLL.lon);
        this.mphmap.infoWindow.show(e.screenPoint,this.mphmap.getInfoWindowAnchor(e.screenPoint));

        if (selfPusherDetails.pusher)
        {
            var latlng = {"x" : fixedLL.lon, "y" : fixedLL.lat,  "z" : "0"};
            console.log("Push coordinates");
            console.debug(latlng);
            selfPusherDetails.pusher.channel(selfPusherDetails.channel).trigger('client-MapClickEvent', latlng);
        }
         */
        }
        catch(error) {
          console.log('We have an error: ' + error);
        }
    }

    // this.pusherEventHandler = new PusherEventHandler.PusherEventHandler(this.mlconfig.getMapNumber());
    //
    // this.pusherEventHandler.addEvent('client-MapXtntEvent', retrievedBounds);
    // this.pusherEventHandler.addEvent('client-MapClickEvent',  retrievedClick);

    async showClickResult(content, mapPt) {
        const [ActionButton] = await loadModules([
              'esri/support/actions/ActionButton'
            ], this.agoOptions);

        var
            // actionList = document.getElementsByClassName('esri-popup__actions')[0],
            // shareBtnId = 'shareSomethingId' + this.selectedMarkerId,
            addedContent;

        let pushContent = this.configForPusher(content);

        let shareAction = new ActionButton({
          title: "Share Info",
          id: "idShareInfo",
          className: 'share-action',
          image: "assets/imgs/share-info.png"
        });

        if (this.mphmap.popup.visible == false) {
            // let mppt = new esriPoint({longitude : mapPt.x, latitude : clickPt.y}),
            this.mphmap.popup.open({location: mapPt});
        }

        if (this.mphmap.popup.actions.length < 2) {
          this.mphmap.popup.actions.push(shareAction);
        }
        this.mphmap.popup.on("trigger-action", (event) =>{
          if(event.action.id === "idShareInfo"){
            this.geopushSup.pusherClientService.publishClickEvent(pushContent);
          }
        });

        if (content === null) {
            addedContent = "Share lat/lon : " + this.fixedLLG.lat + ", " + this.fixedLLG.lon;
            this.mphmap.popup.title = "Ready to Push Click";
            this.mphmap.popup.content = "lat/lon : " + this.fixedLLG.lat + ", " + this.fixedLLG.lon;
        } else {
            if (this.mphmap.popup.content === null) {
              addedContent = 'Share address : ' + content;
              this.mphmap.popup.content = addedContent;
            }
            this.mphmap.popup.watch("currentDockPosition", (value) => {
                console.log("currentDockPosition");
                console.log(value);
            });
        }

    }
    configForPusher(content) {
        var referrerId,
            referrerName,
            pushLL = {};

        // if (selfPusherDetails.pusher) {
            referrerId = this.mlconfig.getUserId();
            referrerName = this.geopushSup.pusherConfig.getUserName();
            pushLL = {
                "x" : this.fixedLLG.lon,
                "y" : this.fixedLLG.lat,
                "z" : this.zmG,
                "referrerId" : referrerId,
                "referrerName" : referrerName,
                'address' : content
            };
            console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + this.fixedLLG.lat + ", " + this.fixedLLG.lon);
            // selfPusherDetails.pusher.channel(selfPusherDetails.channelName).trigger('client-MapClickEvent', pushLL);
            // this.pusherClientService.publishClickEvent(pushLL);
            return pushLL;
        // }
    }

    async setCurrentLocation( loc : MapLocOptions) {
      const [esriPoint, esriSpatialReference, esriLocator,
              esriwebMercatorUtils, watchUtils] = await loadModules([
            'esri/geometry/Point', 'esri/geometry/SpatialReference', 'esri/tasks/Locator',
            'esri/geometry/support/webMercatorUtils', 'esri/core/watchUtils'
          ], this.agoOptions)
      let cntr = new esriPoint({longitude : loc.center.lng, latitude : loc.center.lat, spatialReference : new esriSpatialReference({wkid: 4326})});
      this.mphmap.goTo({target : cntr, zoom : this.zmG});
      let xtExt = this.extractBounds(this.mphmap.zoom, cntr, 'pan');
      xtExt.then( (xtExt) => {
        this.setBounds(xtExt);
        this.addGraphic(cntr);
      });
    }

    async addGraphic(pt){
      const [esriPoint, esriSimpleMarkerSymbol, esriSimpleLineSymbol,
            esriGraphic] = await loadModules([
            'esri/geometry/Point', 'esri/symbols/SimpleMarkerSymbol', 'esri/symbols/SimpleLineSymbol',
            'esri/Graphic'
          ], this.agoOptions)
      let symbol = new esriSimpleMarkerSymbol({
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      });

      let graphic = new esriGraphic({
        geometry: pt,
        symbol: symbol
      });
      this.mphmap.graphics.add(graphic);
    }

    async configureMap(xtntMap, zoomWebMap, pointWebMap, mlcfg) { // newMapId, mapOpts
      const [esriPoint, esriSpatialReference, esriLocator,
              esriwebMercatorUtils, watchUtils] = await loadModules([
            'esri/geometry/Point', 'esri/geometry/SpatialReference', 'esri/tasks/Locator',
            'esri/geometry/support/webMercatorUtils', 'esri/core/watchUtils'
          ], this.agoOptions)
        console.log("MapHosterArcGIS configureMap");
        this.mphmap = xtntMap;
        this.mapReady = false;
        this.mlconfig = mlcfg;
        var qlat, qlon, qzoom, startCenter,
            // mpWrap = null,
            // mpCan = null,
            mpCanRoot = null;
            // currentVerbVis = false;; //, location;
        // alert("before first update globals");

        this.pusherEventHandler = new PusherEventHandler(this.mlconfig.getMapNumber());

        this.pusherEventHandler.addEvent('client-MapXtntEvent', (xj) => this.retrievedBounds(xj));
        // this.pusherEventHandler.addEvent('client-MapXtntEvent', this.retrievedBounds);
        this.pusherEventHandler.addEvent('client-MapClickEvent', (clickPt) => this.retrievedClick(clickPt));

        if (zoomWebMap !== null) {
            await this.updateGlobals("in configureMap - init with attributes in args",
                xtntMap.center.longitude, xtntMap.center.latitude, xtntMap.zoom);
        } else {

            qlat = this.mlconfig.lat();
            qlon = this.mlconfig.lon();
            qzoom = this.mlconfig.zoom();

            if (qlat !== '') {
                await this.updateGlobals("in configureMap - MapHosterArcGIS init with qlon, qlat", qlon, qlat, qzoom);
            } else {
                await this.updateGlobals("in configureMap - MapHosterArcGIS init with hard-coded values", -87.620692, 41.888941, 13);
            }

            // updateGlobals("init standard", -87.7, 41.8, 13);
        }
        this.showGlobals("in configureMap - MapHosterArcGIS - Prior to new Map");
        // alert("showed first globals");
        startCenter = new esriPoint({longitude : this.cntrxG, latitude : this.cntryG, spatialReference : new esriSpatialReference({wkid: 4326})});

        await this.updateGlobals("in configureMap - using startCenter", startCenter.x, startCenter.y, this.zmG);
        this.showGlobals("Prior to startup centerAndZoom");
        // this.mphmap.centerAndZoom(startCenter, this.zmG);
        this.mphmap.goTo({target : startCenter, zoom : this.zmG});
        this.showGlobals("After centerAndZoom");
        this.geopushSup.pusherClientService.publishPanEvent({lat : startCenter.y, lon : startCenter.x, zoom : this.zmG});

        this.initMap("mapDiv_layer0");
        this.geoLocator = new esriLocator({url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"});
        // addInitialSymbols();
        let ll = esriwebMercatorUtils.xyToLngLat(this.mphmap.extent.xmin, this.mphmap.extent.ymin);
        let ur = esriwebMercatorUtils.xyToLngLat(this.mphmap.extent.xmax, this.mphmap.extent.ymax);
        this.bounds = new MLBounds(ll[0], ll[1], ur[0], ur[1]);
        this.userZoom = true;

        this.mphmap.on('zoom-start', function (evt) {
            this.zmG = evt.level;
        });
        this.mphmap.on('zoom-end', function (evt) {
            console.debug("onZoomEnd with userZoom = " + this.userZoom);
            if (this.userZoom === true) {
                this.setBounds(this.extractBounds(this.mphmap.getLevel(), evt.extent.getCenter(), 'zoom'));
            }
            // this.userZoom = true;
        });

        watchUtils.whenTrue(this.mphmap, 'stationary', async (evt) => {
          if (this.mphmap.extent) {
            if (this.userZoom === true) {
                let bnds = await this.extractBounds(this.mphmap.zoom, this.mphmap.center, 'zoom');
                this.setBounds(bnds);
            }
          }
        });

        this.mphmap.on('pan-start', function (evt) {
            // event.stop(evt);
            console.log('pan-start');
        });

        this.mphmap.on('drag', (evt) => {
            if (evt.action == 'end') {
              if (this.userZoom === true) {
                  // let mapPt = this.mphmap.toMap({x : evt.x, y : evt.y});
                  let mapPt = this.mphmap.extent.center;
            let ll = esriwebMercatorUtils.xyToLngLat(this.mphmap.extent.xmin, this.mphmap.extent.ymin);
            let ur = esriwebMercatorUtils.xyToLngLat(this.mphmap.extent.xmax, this.mphmap.extent.ymax);
            this.bounds = new MLBounds(ll[0], ll[1], ur[0], ur[1]);
            // this.bounds = this.mphmap.extent;
            this.mlconfig.setBounds(this.bounds);
                  let xtExt = this.extractBounds(this.mphmap.zoom, mapPt, 'pan');
                  xtExt.then( (xtExt) => {
                    this.setBounds(xtExt);
                  });
                }
            }
        });

        this.mphmap.on('pan-end', function (evt) {
            if (this.userZoom === true) {
                this.setBounds(this.extractBounds(this.mphmap.getLevel(), evt.extent.getCenter(), 'pan'));
            }
        });
        this.mphmap.on('pointer-move', (evt) => {


            var // pnt = new Point({longitude : evt.mapPoint.x, latitude : evt.mapPoint.y}),
                ltln = this.mphmap.toMap({x: evt.x, y: evt.y}),
                // ltln = esriwebMercatorUtils.xyToLngLat(evt.mapPoint.x, evt.mapPoint.y),
                fixedLL = this.utils.toFixedTwo(ltln.longitude, ltln.latitude, 4),
                evlng = fixedLL.lon,
                evlat = fixedLL.lat
            this.geopushSup.positionUpdateService.positionData.emit(
                {'key' : 'coords',
                  'val' : {
                    'zm' : this.zmG,
                    'scl' : this.scale2Level.length > 0 ? this.scale2Level[this.zmG].scale : 3,
                    'cntrlng' : evlng,
                    'cntrlat': evlat,
                    'evlng' : evlng,
                    'evlat' : evlat
              }
            });
        });

        this.mphmap.on("click", (evt) => {
          this.onMapClick(evt);
        });
        /*
        window.addEventListener("resize", () => {
            // this.mphmap.resize();                         //********* resize not yet fixed

            mpCanRoot.style.width = "100%";
            mpCanRoot.style.height = "100%";
        });
        */
        this.mapReady = true;
        this.userZoom = true;

        // mpWrap = document.getElementById("map_wrapper");
        // mpCan = document.getElementById("map_canvas");
        // mpCanRoot = document.getElementById("map_canvas_root");

        // mpWrap = document.getElementById("map_wrapper");
        // mpCan = document.getElementById("map_" + this.mlconfig.getMapNumber());
        mpCanRoot = document.getElementById("map" + this.mlconfig.getMapNumber() + "_root");
    }
    getSearchBounds() {
            console.log("MapHosterArcGIS getSearchBounds");
            var bounds = this.mphmap.extent;
            console.debug(bounds);
            return bounds;
        }
    retrievedNewPosition(pos) {
        console.log("Back in retrievedNewPosition");
        console.log(pos);
        console.log('open map using framework {pos.maphost} at x {pos.lon}, y {pos.lat} zoom {pos.zoom}');
    }

    getGlobalsForUrl() {
        console.log(" MapHosterArcGIS.prototype.getGlobalsForUrl");
        console.log("&lon=" + this.cntrxG + "&lat=" + this.cntryG + "&zoom=" + this.zmG);
        return "&lon=" + this.cntrxG + "&lat=" + this.cntryG + "&zoom=" + this.zmG;
    }

    getGlobalPositionComponents() {
        return {"lon" : this.cntrxG, "lat" : this.cntryG, "zoom" : this.zmG};
    }

    getCenter() {
        var pos = { 'lon' : this.cntrxG, 'lat' : this.cntryG, 'zoom' : this.zmG};
        console.log("return accurate center from getCenter()");
        console.debug(pos);
        return pos;
    }

    getPusherEventHandler() {
        return this.pusherEventHandler;
    }
    removeEventListeners() {
        // this.mphmap.removeListener();
        console.log("empty function removeEventListners");
    }

    getmlconfig() {
        return this.mlconfig;
    }
}
