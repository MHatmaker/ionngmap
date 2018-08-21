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
import { MapLocOptions, MapLocCoords } from '../../services/positionupdate.interface';
import { MLBounds, ImlBounds } from '../../services/mlbounds.service';
import { SearchplacesProvider } from '../../providers/searchplaces/searchplaces';

declare var google;

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.scss']
})
export class MapsPage implements AfterViewInit {
    private selectedMapType : string;
    private outerMapNumber : number = 0;
    private mlconfig : MLConfig;
    private menuActions = {};
    private pusherEventHandler : PusherEventHandler;
    private mapHosterDict : Map<string, any> = new Map<string, any>([
        ['google', MultiCanvasGoogle],
        ['esri', MultiCanvasEsri],
        ['leaflet', MultiCanvasLeaflet]
    ]);

  constructor( private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
              private slideshareService : SlideShareService, pageService : PageService,
              private slideViewService : SlideViewService, private modalCtrl : ModalController,
              private mapOpener : MapopenerProvider, private hostConfig : HostConfig) { //}, private searchPlaces : SearchplacesProvider) {
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
              let mploc : MapLocOptions = {center: mplocCoords, zoom: 15, places: null};
              let mlcfg = new MLConfig({mapId : -1, mapType : 'esri', webmapId : data.id,
                mlposition : cntr, source : EMapSource.srcagonline});
              mlcfg.setBounds(xtnt);
              this.addCanvas('esri', mlcfg, mploc);

          });
          modal.present();
        },
        'Sharing Instructions' : () => {
            this.showSharingHelp();
        },
        'Share Map' : () => {
          let modal = modalCtrl.create(MsgsetupComponent);
          modal.present();
          modal.onDidDismiss((data) => {
              this.onNewMapPosition(data);
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
        /*
        if ( data.displayName === 'MapLinkr') {
            // alert("MapLinkr!");
            let mp = this.mlconfig.getRawMap();
            let bnds = mp.getBounds();
            console.log(bnds);
        } else {
            this.onsetMap(data);
        }
        */
      });
      mapOpener.openMap.subscribe(
          (data : MapLocOptions) => {
            this.addCanvas('google', null, data)
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
      this.addCanvas( menuOption.displayName, null, null);
  }
  onNewMapPosition (pos) {
      // let pos2prt : string = `onNewMapPosition handler -
      //       referrer ${pos.referrerId}, at x ${pos.lon}, y ${pos.lat}, zoom ${pos.zoom}`,
          // baseUrl = this.hostConfig.getbaseurl(),
          // completeUrl = baseUrl + pos.maphost + pos.search,
      let nextWindowName = this.hostConfig.getNextWindowName();
          // $inj,
          // modalInstance,
          // popresult = null;
      // console.log(pos2prt);
      console.log("search url :");
      console.log(pos.search);
      console.log('completeUrl');
      // console.debug(completeUrl);
      // console.log(`userId = " ${this.hostConfig.getUserId()} referrerId = ${this.hostConfig.getReferrerId()}
      //     pos.referrerId = ${pos.referrerId}`);
      console.log(`is Initial User ? ${this.hostConfig.getInitialUserStatus()}`);
      console.log(`Open new window with name ${nextWindowName}`);

      if (this.hostConfig.getUserName()) {
          // completeUrl += "&userName=" + this.hostConfig.getUserName();
          let searchPlaces = new SearchplacesProvider(this.mapInstanceService);
          let places = searchPlaces.searchForPlaces(pos);
          if (places) {
              let mplocCoords : MapLocCoords = {lat: searchPlaces.lat(), lng: searchPlaces.lon()};
              let mploc : MapLocOptions = {center: mplocCoords, zoom: searchPlaces.zoom(), places: places};
              this.addCanvas('google', null, mploc);
          }
          // let popresult = window.open(completeUrl, nextWindowName, this.hostConfig.getSmallFormDimensions());
      }
  }
  addCanvas (mapType : string, mlcfg : MLConfig, maploc : MapLocOptions) {
      console.log("in map.component.addCanvas");
      var currIndex : number = this.mapInstanceService.getSlideCount(),
          appendedElem,
          mapTypeToCreate,
          ipos,
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
                  ipos = <IPosition>{'lon' : maploc.center.lng, 'lat' : maploc.center.lat, 'zoom' : maploc.zoom};
              } else {
                  let initialMaploc = this.canvasService.getInitialLocation();
                  maploc = initialMaploc;
                  ipos = <IPosition>{'lon' : initialMaploc.center.lng, 'lat' : initialMaploc.center.lat, 'zoom' : initialMaploc.zoom};
                  // let ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15};
              }
            } else {
                  let initialMaploc = this.canvasService.getInitialLocation();
                  maploc = initialMaploc;
                  ipos = <IPosition>{'lon' : initialMaploc.center.lng, 'lat' : initialMaploc.center.lat, 'zoom' : initialMaploc.zoom};
            }

            let cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : this.selectedMapType,
                webmapId : "nowebmap", mlposition :ipos, source : EMapSource.srcgoogle},
            mlconfig = new MLConfig(cfgparams);
            mlconfig.setHardInitialized(true);
            mlconfig.setInitialPlaces(maploc.places);
            // newpos = new MLPosition(-1, -1, -1);
            // icfg = <IConfigParams>{mapId : -1, mapType : 'unknown', webmapId : '', mlposition : newpos}
            // mlConfig = new MLConfig(icfg);
            console.log("addCanvas with index " + currIndex);
            console.debug(mlConfig);
            mlconfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                currIndex === 0 ? currIndex : currIndex - 1).getConfigParams());
            this.mapInstanceService.setConfigInstanceForMap(currIndex, mlconfig); //angular.copy(mlConfig));

      }
      mapTypeToCreate = this.mapHosterDict.get(mapType);

      appendedElem = this.canvasService.addCanvas(mapType, mapTypeToCreate, mlConfig, maploc); // mlcfg, resolve); //appendNewCanvasToContainer(mapTypeToCreate, currIndex);

      // this.mapInstanceService.incrementMapNumber();
      // this.mapInstanceService.setCurrentSlide(currIndex);
      // this.slideshareService.slideData.emit({
      //             mapListItem: appendedElem,
      //             slideNumber: currIndex,
      //             mapName: "Map " + currIndex
      //         });
  }
  removeCanvas (clickedItem) {
      console.log("removeCanvas");
      console.debug(clickedItem);
      // MapInstanceService.removeInstance(CarouselCtrl.getCurrentSlideNumber());
      this.slideshareService.slideRemove.emit();
  }
}
