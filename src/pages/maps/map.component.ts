import {
    Component,
    ViewChild,
    AfterViewInit} from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { IPosition, MLPosition } from '../../services/position.service';
import { IConfigParams, EMapSource } from '../../services/configparams.service';
import { MLConfig } from '../mlcomponents/libs/MLConfig';
import { HostConfig } from '../mlcomponents/libs/HostConfig';
import { PusherConfig } from '../mlcomponents/libs/PusherConfig';
import { PusherEventHandler } from '../mlcomponents/libs/PusherEventHandler';
import { PusherClientService } from '../../services/pusherclient.service';
import { MapInstanceService} from '../../services/MapInstanceService';
// import { CarouselComponent} from '../mlcomponents/Carousel/carousel.component';

import { MultiCanvasEsri } from '../mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../mlcomponents/MultiCanvas/multicanvasgoogle.component';
import { MultiCanvasLeaflet } from '../mlcomponents/MultiCanvas/multicanvasleaflet.component';
import { CanvasService } from '../../services/CanvasService';
// import { ISlideData } from "../../services/slidedata.interface";
import { SlideShareService } from '../../services/slideshare.service';
import { SlideViewService } from '../../services/slideview.service';
import { MenuOptionModel } from './../../side-menu-content/models/menu-option-model';
import { PageService } from "../../services/pageservice"
import { NewsComponent } from "../../components/news/news";
import { LinkrhelpComponent } from "../../components/linkrhelp/linkrhelp";
import { SharinghelpComponent } from "../../components/sharinghelp/sharinghelp";
import { LocateselfComponent } from "../../components/locateself/locateself";
import { PushersetupComponent } from "../../components/pushersetup/pushersetup";
import { MsgsetupComponent } from "../../components/msgsetup/msgsetup";
import { AgogroupComponent } from "../../components/agogroup/agogroup";
import { AgoitemComponent } from "../../components/agoitem/agoitem";
import { HiddenmapComponent } from "../../components/hiddenmap/hiddenmap";
import { MapopenerProvider } from "../../providers/mapopener/mapopener";
import { MapLocOptions, MapLocCoords, IMapShare } from '../../services/positionupdate.interface';
import { MLBounds, ImlBounds } from '../../services/mlbounds.service';
import { SearchplacesProvider } from '../../providers/searchplaces/searchplaces';
import { AppModule } from '../../app/app.module';

declare var google;

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.scss']
})
export class MapsPage implements AfterViewInit {
    @ViewChild(HiddenmapComponent) private hiddenMap:
      HiddenmapComponent;
    private outerMapNumber : number = 0;
    private mlconfig : MLConfig;
    private menuActions = {};
    private pusherEventHandler : PusherEventHandler;
    private mapHosterDict : Map<string, any> = new Map<string, any>([
        ['google', MultiCanvasGoogle],
        ['arcgis', MultiCanvasEsri],
        ['leaflet', MultiCanvasLeaflet]
    ]);

  constructor( private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
              private slideshareService : SlideShareService, pageService : PageService,
              private slideViewService : SlideViewService, private modalCtrl : ModalController,
              private mapOpener : MapopenerProvider, private hostConfig : HostConfig, private pusherConfig : PusherConfig) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.selectedMapType = navParams.subItems.length == 0 ?  'google' : navParams.subItems[0].displayName; //get('title');

    this.menuActions = {
        'Latest News' : () => {
          let modal = modalCtrl.create(NewsComponent);
          modal.present();
        },
        'Using MapLinkr' : () => {
            this.showUsing();
        },
        'Locate Self' : () => {
            this.showLocate(false);
        },
        'Search Group' : () => {
          let modal = modalCtrl.create(AgogroupComponent);
          modal.present();
        },
        'Search Map' : () => {
          this.searchMap();
        },
        'Sharing Instructions' : () => {
            this.showSharingHelp();
        },
        'Share Map' : () => {
          let modal = modalCtrl.create(MsgsetupComponent);
          modal.present();
          modal.onDidDismiss((mode, data) => {
              if(mode == 'usepush') {
                  let pusherClientService = AppModule.injector.get(PusherClientService);
                  // publish stringifyed IMapShare
                  pusherClientService.publishPosition(data);
                  // this.onNewMapPosition(data);
            }
          });
        },
        'Pusher Setup' : () => {
          let modal = modalCtrl.create(PushersetupComponent);
          modal.present();
        },
        'Remove Map' : () => {
          this.removeCanvas(this.mapInstanceService.getCurrentSlide())
        }
    };

    pageService.menuOption.subscribe(
      (data: MenuOptionModel) => {
        console.log(data);
        if(this.mapHosterDict.has(data.displayName)) {
            this.onsetMap(data);
        } else {
            this.menuActions[data.displayName]();
        }
      });
      mapOpener.openMap.subscribe(
          (data : IMapShare) => {
            console.log("mapOpener.openMap subscriber entered");
            console.log(`source is ${data.source}`);
            if(data.source == EMapSource.urlgoogle) {
                this.addCanvasGoogle(data,);
            } else if (data.source == EMapSource.placesgoogle){
                this.addCanvasGoogle(data);
            } else if (data.source == EMapSource.sharegoogle || data.source == EMapSource.srcagonline) {
                this.onNewMapPosition(data);
            } else {
                console.log("invalid EMapSource");
            }
      });
      this.showLocate(true);

  }
  async searchMap() {
      let modal = this.modalCtrl.create(AgoitemComponent);
      modal.onDidDismiss(async (data) => {
          console.log("Ago dialog dismissed processing");
          console.log(data);
          if(data != 'cancelled') {
              let xtnt : MLBounds = data.defaultExtent; //new MLBounds(data.extent[0][0], data.extent[0][1], data.extent[1][0], data.extent[1][1]);
              let xcntr = await xtnt.getCenter();
              let cntr : IPosition = new MLPosition(xcntr['x'], xcntr['y'], 15);
              let mplocCoords : MapLocCoords = {lat: xcntr['x'], lng: xcntr['y']};
              let mploc : MapLocOptions = {center: mplocCoords, zoom: 15, places: null, query: null};
              let mlcfg = new MLConfig({mapId : -1, mapType : 'arcgis', webmapId : data.id,
                mlposition : cntr, source : EMapSource.srcagonline, bounds : xtnt});
              mlcfg.setBounds(xtnt);// this is'nt the first map oened in this session
              if(! this.mapInstanceService.getHiddenMap() ) {
                  this.mapOpener.addHiddenCanvas.emit();
              }
              let opts : IMapShare = {mapLocOpts : mploc, userName : this.hostConfig.getUserName(), mlBounds : xtnt,
                  source : EMapSource.srcagonline, webmapId : data.id};
              this.addCanvasArcGIS(opts, mlcfg, data.id);
          }
      });
      modal.present();
  }

  ngAfterViewInit() {
    this.pusherEventHandler = new PusherEventHandler(-101);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');
  }

  showUsing() {
    let modal = this.modalCtrl.create(LinkrhelpComponent);
    modal.present();
    modal.onDidDismiss((mode, data) => {
      console.log('showUsing returned');
      console.log(mode);
    });
  }
  showLocate(showModal : boolean) {
      console.log('show locate');

      if(showModal) {
        let modal = this.modalCtrl.create(LocateselfComponent);
        modal.present();
        modal.onDidDismiss((mode, data) => {
          console.log('showLocate returned');
          console.log(mode);
          if(mode == 'showme') {
            this.canvasService.addInitialCanvas(this.pusherConfig.getUserName());
          } else if (mode == 'usequery') {
            console.log('must be a request for Ago Online item on startup')
          } else {
            let modal = this.modalCtrl.create(PushersetupComponent);
            modal.present();
            this.searchMap();
            return;
          }
        });
      } else {
        this.canvasService.getCurrentLocation(false);
      }
  }
  showSharingHelp() {
    let modal = this.modalCtrl.create(SharinghelpComponent);
    modal.present();
    modal.onDidDismiss((mode, data) => {
      console.log('showUsing returned');
      console.log(mode);
    });
  }

  onsetMap (menuOption : MenuOptionModel) {
      let srcdct = {
          'google' : EMapSource.srcgoogle,
          'arcgis' : EMapSource.srcagonline,
          'leaflet': EMapSource.srcleaflet
      }
      let opts : IMapShare = {mapLocOpts : null, userName : this.hostConfig.getUserName(), mlBounds : null,
          source : EMapSource.srcagonline, webmapId : 'nowebmap'};
      if(menuOption.displayName == 'google') {
          this.addCanvasGoogle(opts);
      }
      // this.addCanvas( menuOption.displayName, srcdct[menuOption.displayName], null, null, 'nowebmap');
  }

  onNewMapPosition (opts : IMapShare) {

      let nextWindowName = this.hostConfig.getNextWindowName();
      console.log(`is Initial User ? ${this.hostConfig.getInitialUserStatus()}`);
      console.log(`onNewMapPosition - Open new window with name ${nextWindowName}, query : ${opts.mapLocOpts.query},
            source : ${opts.source}`);
      let referrerName = opts.userName;
      // this isn't a shared map if it is coming from us and we aleady have it open
      if (this.hostConfig.getUserName() !== referrerName) {
          if(opts.source == EMapSource.sharegoogle) {
                  this.addCanvasGoogle(opts);
          }
          else if (opts.source == EMapSource.srcagonline) {
                console.log(`addCanvas with arcgis, source : ${opts.source}`);
                let ipos = opts.mapLocOpts.center;
                let zm = opts.mapLocOpts.zoom;
                let cntr : IPosition = new MLPosition(ipos.lng, ipos.lat, zm);
                let mlcfg = new MLConfig({mapId : -1, mapType : 'arcgis', webmapId : opts.webmapId,
                  mlposition : cntr, source : EMapSource.srcagonline, bounds : opts.mlBounds});

                this.addCanvasArcGIS(opts, mlcfg, opts.webmapId);
          }
      }
  }

  async addCanvasGoogle(opts : IMapShare) {
    let ipos : IPosition = null,
        mlConfig : MLConfig,
        currIndex : number = this.mapInstanceService.getNextSlideNumber();
    let cfg = this.mapInstanceService.getRecentConfig(); // is this  the first map opened on startup
    if (cfg === null) {
        if (opts.source == EMapSource.urlgoogle) { // someone sent us a url in email or message
            console.log("get maploc from maploc argument in url");
            console.log(opts.mapLocOpts);

            console.log(`mapLocOpts : lng : ${opts.mapLocOpts.center.lng}, lat : ${opts.mapLocOpts.center.lat}`);
            ipos = new MLPosition(opts.mapLocOpts.center.lng, opts.mapLocOpts.center.lat, opts.mapLocOpts.zoom);
            console.log("ipos");
            console.log(ipos);
            console.log(opts.mapLocOpts);
            let urlquery = this.hostConfig.getQuery(); // was read from location.search on app initialization
            console.log(`urlquery is ${urlquery}`);
            // alert (urlquery);
            if(urlquery && urlquery != '') {
                if(! this.mapInstanceService.getHiddenMap() ) {
                    let startupQuery = this.hostConfig.assembleStartupQuery();
                    let mapLocOpts = startupQuery.mapLocOpts;
                    ipos = <IPosition>{'lon' : mapLocOpts.center.lng, 'lat' : mapLocOpts.center.lat,
                        'zoom' : mapLocOpts.zoom};
                }
            }
        } else {
            // This should have happened on the first map instance in canvasService ctor
            console.log("get maploc from initial location from gps");
            await this.canvasService.awaitInitialLocation();
            opts.mapLocOpts = this.canvasService.getInitialLocation();
            console.log(opts.mapLocOpts);
            ipos = <IPosition>{'lon' : opts.mapLocOpts.center.lng, 'lat' : opts.mapLocOpts.center.lat,
                'zoom' : opts.mapLocOpts.zoom};
        }
        let cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : 'google',
            webmapId : null, mlposition :ipos, source : opts.source, bounds : opts.mlBounds};
        console.log(cfgparams);
        mlConfig = new MLConfig(cfgparams);
      } else { // this is'nt the first map oened in this session
          if(! this.mapInstanceService.getHiddenMap() ) {
              this.mapOpener.openMap.emit(null);
          }
          if(opts.source == EMapSource.placesgoogle || opts.source == EMapSource.sharegoogle) {
              ipos = <IPosition>{'lon' : opts.mapLocOpts.center.lng, 'lat' : opts.mapLocOpts.center.lat,
                      'zoom' : opts.mapLocOpts.zoom};
          } else {
              console.log('create maploc at initial position');
              let initialMaploc = this.canvasService.getInitialLocation();
              opts.mapLocOpts = initialMaploc;
              ipos = <IPosition>{'lon' : initialMaploc.center.lng, 'lat' : initialMaploc.center.lat,
                  'zoom' : initialMaploc.zoom};
          }

          let cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : 'google',
              webmapId : null, mlposition :ipos, source : opts.source, bounds : cfg.getBounds()};
          console.log(cfgparams);
          mlConfig = new MLConfig(cfgparams);
      }

      mlConfig.setUserName(this.pusherConfig.getUserName());
      console.log("setInitialPlaces with places:");
      console.log(opts.mapLocOpts.places);
      mlConfig.setInitialPlaces(opts.mapLocOpts.places);
        console.log(`setQuery with ${opts.mapLocOpts.query}`);
      mlConfig.setQuery(opts.mapLocOpts.query);
      if(opts.source == EMapSource.urlgoogle) {
          mlConfig.setSearch(this.hostConfig.getSearch());
          mlConfig.setQuery(this.hostConfig.getQuery());
      }

      if (currIndex == 0) {
          this.mapInstanceService.setConfigInstanceForMap(0, mlConfig);
      } else {
          if(opts.source == EMapSource.sharegoogle || opts.source == EMapSource.placesgoogle) {
              console.log('get config from shared config');
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
          } else {
              console.log("get config from map in previous slide");
              mlConfig.setConfigParams(this.mapInstanceService.getRecentConfig().getConfigParams());
              // mlConfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
              //     currIndex - 1).getConfigParams());
              mlConfig.setSource(opts.source);
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
          }
      }
      let mapTypeToCreate = this.mapHosterDict.get('google');

      let appendedElem = this.canvasService.addCanvas('google', mapTypeToCreate, opts.source, mlConfig, opts.mapLocOpts);
  }

  async addCanvasArcGIS (opts : IMapShare, mlcfg : MLConfig, ago : string) {
      console.log("in map.component.addCanvasArcGIS");
      var currIndex : number = this.mapInstanceService.getNextSlideNumber(),
          appendedElem : HTMLElement,
          mapTypeToCreate,
          ipos : IPosition,
          agoId : string = ago,
          mlConfig : MLConfig = mlcfg,
          userName = this.pusherConfig.getUserName();
      if (mlcfg) {
          mlConfig = mlcfg;
          mlConfig.setMapId(currIndex);
          mlConfig.setUserName(userName);
          // mlConfig.setHardInitialized(true);
          mlConfig.setInitialPlaces(opts.mapLocOpts.places);
            mlConfig.setQuery(opts.mapLocOpts.query);
            if( opts.source == EMapSource.srcagonline) {
                mlConfig.setSearch(this.hostConfig.getSearch());
                mlConfig.setQuery(this.hostConfig.getQuery());
            }
          this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
      }

      mapTypeToCreate = this.mapHosterDict.get('arcgis');
      appendedElem = this.canvasService.addCanvas('arcgis', mapTypeToCreate, opts.source, mlConfig, opts.mapLocOpts); // mlcfg, resolve); //appendNewCanvasToContainer(mapTypeToCreate, currIndex);

  }
  async addCanvas (mapType : string, opts : IMapShare, mlcfg : MLConfig, ago : string) {
      console.log("in map.component.addCanvas");
      var currIndex : number = this.mapInstanceService.getNextSlideNumber(),
          appendedElem : HTMLElement,
          mapTypeToCreate,
          ipos : IPosition,
          agoId : string = ago,
          mlConfig,
          userName = this.pusherConfig.getUserName();
          console.log(`addCanvas set userName to ${userName}`);
      if (mlcfg) {
          mlConfig = mlcfg;
          mlConfig.setMapId(currIndex);
          mlConfig.setUserName(userName);
          // mlConfig.setHardInitialized(true);
          mlConfig.setInitialPlaces(opts.mapLocOpts.places);
          this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
      } else {
          let cfg = this.mapInstanceService.getRecentConfig();
          if (cfg === null) {
          // if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
              // starting up from url with or without query or mobile app startup
              if (opts.mapLocOpts) {
                  console.log("get maploc from maploc argument in url");
                  console.log(opts.mapLocOpts);

                  console.log(`mapLocOpts : lng : ${opts.mapLocOpts.center.lng}, lat : ${opts.mapLocOpts.center.lat}`);
                  ipos = new MLPosition(opts.mapLocOpts.center.lng, opts.mapLocOpts.center.lat, opts.mapLocOpts.zoom);
                  console.log("ipos");
                  console.log(ipos);
                  console.log(opts.mapLocOpts);
              } else {
                  // This should have happend on the first map instance in canvasService ctor
                  console.log("get maploc from initial location");
                  await this.canvasService.awaitInitialLocation();
                  opts.mapLocOpts = this.canvasService.getInitialLocation();
                  console.log(opts.mapLocOpts);
                  ipos = <IPosition>{'lon' : opts.mapLocOpts.center.lng, 'lat' : opts.mapLocOpts.center.lat, 'zoom' : opts.mapLocOpts.zoom};
              }
            } else {
                  // there is already at least one map open in the slide viewer
                  if(opts.source != EMapSource.sharegoogle) {
                      let gmquery = this.hostConfig.getQuery();
                      console.log(`gmquery is ${gmquery}`);
                      // alert (gmquery);
                      if(gmquery && gmquery != '') {
                          if(! this.mapInstanceService.getHiddenMap() ) {
                              let startupQuery = this.hostConfig.assembleStartupQuery();
                              let mapLocOpts = startupQuery.mapLocOpts;
                              ipos = <IPosition>{'lon' : mapLocOpts.center.lng, 'lat' : mapLocOpts.center.lat,
                                  'zoom' : mapLocOpts.zoom};
                          }
                        } else {
                          if(opts.source == EMapSource.placesgoogle) {
                            ipos = <IPosition>{'lon' : opts.mapLocOpts.center.lng, 'lat' : opts.mapLocOpts.center.lat,
                                      'zoom' : opts.mapLocOpts.zoom}
                          } else {
                            console.log('create maploc at initial position');
                            let initialMaploc = this.canvasService.getInitialLocation();
                            opts.mapLocOpts = initialMaploc;
                            ipos = <IPosition>{'lon' : initialMaploc.center.lng, 'lat' : initialMaploc.center.lat, 'zoom' : initialMaploc.zoom};
                          }
                      }
                  }
            }

            let cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : mapType,
                webmapId : agoId, mlposition :ipos, source : opts.source, bounds : cfg ? cfg.getBounds() : null};
            console.log(cfgparams);
            mlConfig = new MLConfig(cfgparams);
            mlConfig.setUserName(userName);
            // mlConfig.setBounds(opts.mlBounds);

            console.log("created new MLConfig with cfgparams:");
            console.log(cfgparams);
            mlConfig.setHardInitialized(true);
            console.log("setInitialPlaces with places:");
            console.log(opts.mapLocOpts.places);
            mlConfig.setInitialPlaces(opts.mapLocOpts.places);
              console.log(`setQuery with ${opts.mapLocOpts.query}`);
            mlConfig.setQuery(opts.mapLocOpts.query);
            if( opts.source == EMapSource.urlgoogle || opts.source == EMapSource.srcagonline) {
                mlConfig.setSearch(this.hostConfig.getSearch());
                mlConfig.setQuery(this.hostConfig.getQuery());
            }
            // newpos = new MLPosition(-1, -1, -1);
            // icfg = <IConfigParams>{mapId : -1, mapType : 'unknown', webmapId : '', mlposition : newpos}
            // mlConfig = new MLConfig(icfg);
            console.log(`addCanvas with index ${currIndex} using mlConfig :`);
            console.debug(mlConfig);
            if (currIndex == 0) {
                this.mapInstanceService.setConfigInstanceForMap(0, mlConfig);
            } else {
                if(opts.source == EMapSource.sharegoogle || opts.source == EMapSource.srcagonline || opts.source == EMapSource.placesgoogle) {
                    console.log('get config from shared config');
                    this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
                } else {
                    console.log("get config from map in previous slide");
                    mlConfig.setConfigParams(this.mapInstanceService.getRecentConfig().getConfigParams());
                    // mlConfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                    //     currIndex - 1).getConfigParams());
                    mlConfig.setSource(opts.source);
                    this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
                }
            }

      }
      mapTypeToCreate = this.mapHosterDict.get(mapType);

      appendedElem = this.canvasService.addCanvas(mapType, mapTypeToCreate, opts.source, mlConfig, opts.mapLocOpts); // mlcfg, resolve); //appendNewCanvasToContainer(mapTypeToCreate, currIndex);

  }
  removeCanvas (clickedItem) {
      console.log("removeCanvas");
      console.debug(clickedItem);
      // MapInstanceService.removeInstance(CarouselCtrl.getCurrentSlideNumber());
      this.slideshareService.slideRemove.emit();
  }
}
