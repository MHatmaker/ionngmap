import {
    Component,
    AfterViewInit} from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { IPosition, MLPosition } from '../../services/position.service';
import { IConfigParams, EMapSource } from '../../services/configparams.service';
import { MLConfig } from '../mlcomponents/libs/MLConfig';
import { HostConfig } from '../mlcomponents/libs/HostConfig';
import { GeoPusherSupport } from '../mlcomponents/libs/geopushersupport';
import { PusherEventHandler } from '../mlcomponents/libs/PusherEventHandler';
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
import { PushersetupComponent } from "../../components/pushersetup/pushersetup";
import { MsgsetupComponent } from "../../components/msgsetup/msgsetup";
import { AgogroupComponent } from "../../components/agogroup/agogroup";
import { AgoitemComponent } from "../../components/agoitem/agoitem";
import { MapopenerProvider } from "../../providers/mapopener/mapopener";
import { MapLocOptions, MapLocCoords, IMapShare } from '../../services/positionupdate.interface';
import { MLBounds, ImlBounds } from '../../services/mlbounds.service';
import { SearchplacesProvider } from '../../providers/searchplaces/searchplaces';
import { HiddenmapComponent } from '../../components/hiddenmap/hiddenmap';

declare var google;

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.scss']
})
export class MapsPage implements AfterViewInit {
    private selectedMapType : string = 'google';
    private outerMapNumber : number = 0;
    private mlconfig : MLConfig;
    private menuActions = {};
    private pusherEventHandler : PusherEventHandler;
    private shr : IMapShare = null;
    private mapHosterDict : Map<string, any> = new Map<string, any>([
        ['google', MultiCanvasGoogle],
        ['esri', MultiCanvasEsri],
        ['leaflet', MultiCanvasLeaflet]
    ]);

  constructor( private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
              private slideshareService : SlideShareService, pageService : PageService,
              private slideViewService : SlideViewService, private modalCtrl : ModalController,
              private mapOpener : MapopenerProvider, private hostConfig : HostConfig,
              private geoPush : GeoPusherSupport) {
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
            this.showLocate();
        },
        'Search Group' : () => {
          let modal = modalCtrl.create(AgogroupComponent);
          modal.present();
        },
        'Search Map' : () => {
          let modal = modalCtrl.create(AgoitemComponent);
          modal.onDidDismiss((data) => {
              console.log("Ago dialog dismissed processing");
              console.log(data);
              let xtnt : MLBounds = data.defaultExtent;
              let xcntr = xtnt.getCenter();
              let cntr : IPosition = new MLPosition(xcntr.x, xcntr.y, 15);
              let mplocCoords : MapLocCoords = {lat: xcntr.y, lng: xcntr.x};
              let mploc : MapLocOptions = {center: mplocCoords, zoom: 15, places: null, query: null};
              let mlcfg = new MLConfig({mapId : -1, mapType : 'esri', webmapId : data.id,
                mlposition : cntr, source : EMapSource.srcagonline});
              mlcfg.setBounds(xtnt);
              this.addCanvas('esri', EMapSource.srcagonline, mlcfg, mploc);

          });
          modal.present();
        },
        'Sharing Instructions' : () => {
            this.showSharingHelp();
        },
        'Share Map' : () => {
          let modal = modalCtrl.create(MsgsetupComponent);
          modal.present();
          modal.onDidDismiss((mode, data) => {
              if(mode == 'usepush') {
                  let pusherClientService = this.geoPush.getGeoPusherSupport().pusherClientService;
                  pusherClientService.publishPosition(data);
                  // this.onNewMapPosition(data);
            }
          });
        },
        'Pusher Setup' : () => {
          let modal = modalCtrl.create(PushersetupComponent);
          modal.present();
        }
    };
    console.log("fire up ConfigParams");
    var ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
        cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : this.selectedMapType,
            webmapId : "nowebmap", mlposition : ipos, source : EMapSource.srcmenu },
        mlconfig = new MLConfig(cfgparams);
    this.mlconfig = mlconfig;
    mlconfig.setHardInitialized(true);
    mapInstanceService.setConfigInstanceForMap(this.outerMapNumber, mlconfig);
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
            console.log(`source is ${0}`, data.source);
            if(data.source == EMapSource.urlgoogle) {
                this.addCanvas('google', data.source, null, data.mapLocOpts);
            } else if (data.source == EMapSource.placesgoogle){
                this.addCanvas('google', data.source, null, data.mapLocOpts);
            } else if (data.source == EMapSource.sharegoogle) {
                this.onNewMapPosition(data);
            } else {
                console.log("invalid EMapSource");
            }
      });
  }

  ngAfterViewInit() {
    // this.addCanvas(this.selectedMapType, this.mlconfig, null);
    // this.addCanvas('google', null, null);
    this.pusherEventHandler = new PusherEventHandler(-101);
    this.pusherEventHandler.addEvent('client-NewMapPosition', this.onNewMapPosition);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');
  }
  showUsing() {
      console.log('show using');
  }
  showLocate() {
      console.log('show locate');
      this.canvasService.getCurrentLocation();
  }
  showSharingHelp() {
      console.log('show sharing help');
  }
  showSharing() {
      console.log('show sharing');
  }

  onsetMap (menuOption : MenuOptionModel) {
      this.addCanvas( menuOption.displayName, EMapSource.srcgoogle, null, null);
  }

  async onNewMapPosition (opts : IMapShare) {
      // let pos2prt : string = `onNewMapPosition handler -
      //       referrer ${pos.referrerId}, at x ${pos.lon}, y ${pos.lat}, zoom ${pos.zoom}`,
          // baseUrl = this.hostConfig.getbaseurl(),
          // completeUrl = baseUrl + pos.maphost + pos.search,
      let nextWindowName = this.hostConfig.getNextWindowName();
      console.log(`is Initial User ? ${this.hostConfig.getInitialUserStatus()}`);
      console.log(`onNewMapPosition - Open new window with name ${nextWindowName}, query : ${opts.mapLocOpts.query}`);
      // let opts : IMapShare = JSON.parse(pos);
      let referrerName = opts.userName;

      if (this.hostConfig.getUserName() !== referrerName) {
          // completeUrl += "&userName=" + this.hostConfig.getUserName();
          let searchPlaces = new SearchplacesProvider(this.mapInstanceService);
          await searchPlaces.searchForPlaces(opts, (places) => {
              console.log(`searchForPlaces returned ${places.length}`);
              console.log(places);
              let mplocCoords : MapLocCoords = {lat: searchPlaces.lat(), lng: searchPlaces.lon()};
              let mploc : MapLocOptions = {center: mplocCoords, zoom: searchPlaces.zoom(),
                  places: places, query: opts.mapLocOpts.query};
              this.addCanvas('google', opts.source, null, mploc);
          });
          // let popresult = window.open(completeUrl, nextWindowName, this.hostConfig.getSmallFormDimensions());
      }
  }
  async addCanvas (mapType : string, source : EMapSource, mlcfg : MLConfig, maploc : MapLocOptions) {
      console.log("in map.component.addCanvas");
      var currIndex : number = this.mapInstanceService.getSlideCount(),
          appendedElem : HTMLElement,
          mapTypeToCreate,
          ipos : IPosition,
          startquery : string = '',
          mlConfig;
      if (mlcfg) {
          mlConfig = mlcfg;
          mlConfig.setMapId(currIndex);
          // mlConfig.setHardInitialized(true);
          mlConfig.setInitialPlaces(maploc.places);
          this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
      } else {
          if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
              if ( maploc) {
                  console.log("get maploc from maploc argument");
                  console.log(maploc);
                  ipos = <IPosition>{'lon' : maploc.center.lng, 'lat' : maploc.center.lat, 'zoom' : maploc.zoom};
              } else {
                  console.log("get maploc from initial location");
                  let initialMaploc = this.canvasService.getInitialLocation();
                  maploc = initialMaploc;
                  console.log(maploc);
                  ipos = <IPosition>{'lon' : initialMaploc.center.lng, 'lat' : initialMaploc.center.lat, 'zoom' : initialMaploc.zoom};
                  // let ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15};
              }
            } else {
                  if(source != EMapSource.sharegoogle) {
                      let gmquery = this.hostConfig.getQueryFromUrl();
                      console.log(`gmquery is ${gmquery}`);
                      if(gmquery && gmquery != '') {
                          if(! this.mapInstanceService.getHiddenMap() ) {
                              let bnds = this.hostConfig.getBoundsFromUrl();
                              let lng = +this.hostConfig.lon();
                              let lat = +this.hostConfig.lat();
                              let zm = +this.hostConfig.zoom();
                              let opts = <MapLocOptions>{center : {lng : lng, lat : lat}, zoom : zm, places : null, query : gmquery};
                              this.shr = <IMapShare>{mapLocOpts : opts, userName : this.hostConfig.getUserName(), mlBounds : bnds,
                                  source : EMapSource.urlgoogle};
                              this.hostConfig.setStartupQuery(this.shr);
                              maploc.query = this.hostConfig.getQuery();
                              ipos = <IPosition>{'lon' : lng, 'lat' : lat, 'zoom' : zm};
                              this.selectedMapType = 'google';
                          }
                      } else {
                          console.log('create maploc at initial position');
                          let initialMaploc = this.canvasService.getInitialLocation();
                          maploc = initialMaploc;
                          ipos = <IPosition>{'lon' : initialMaploc.center.lng, 'lat' : initialMaploc.center.lat, 'zoom' : initialMaploc.zoom};
                      }
                  }
            }

            let cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : this.selectedMapType,
                webmapId : "nowebmap", mlposition :ipos, source : source},
            mlconfig = new MLConfig(cfgparams);
            console.log("create new MLConfig with cfgparams:");
            console.log(cfgparams);
            mlconfig.setHardInitialized(true);
            console.log("setInitialPlaces with places:");
            console.log(maploc.places);
            mlconfig.setInitialPlaces(maploc.places);
            console.log(`setQuery with ${maploc.query}`);
            mlconfig.setQuery(maploc.query);
            mlconfig.setSearch(this.hostConfig.getSearch());
            // newpos = new MLPosition(-1, -1, -1);
            // icfg = <IConfigParams>{mapId : -1, mapType : 'unknown', webmapId : '', mlposition : newpos}
            // mlConfig = new MLConfig(icfg);
            console.log("addCanvas with index " + currIndex);
            console.debug(mlconfig);
            if (currIndex == 0) {
                this.mapInstanceService.setConfigInstanceForMap(0, mlconfig);
            } else {
                if(source == EMapSource.sharegoogle) {
                    console.log('get config from shared config');
                    this.mapInstanceService.setConfigInstanceForMap(currIndex, mlconfig);
                } else {
                    console.log("get config from map in previous slide");
                    mlconfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                        currIndex - 1).getConfigParams());
                    mlconfig.setSource(source);
                    this.mapInstanceService.setConfigInstanceForMap(currIndex, mlconfig);
                }
            }

      }
      mapTypeToCreate = this.mapHosterDict.get(mapType);

      appendedElem = this.canvasService.addCanvas(mapType, mapTypeToCreate, source, mlConfig, maploc); // mlcfg, resolve); //appendNewCanvasToContainer(mapTypeToCreate, currIndex);

  }
  removeCanvas (clickedItem) {
      console.log("removeCanvas");
      console.debug(clickedItem);
      // MapInstanceService.removeInstance(CarouselCtrl.getCurrentSlideNumber());
      this.slideshareService.slideRemove.emit();
  }
}
