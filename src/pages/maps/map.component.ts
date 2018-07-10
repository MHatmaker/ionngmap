import {
    Component,
    AfterViewInit} from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { IPosition, MLPosition } from '../../services/position.service';
import { IConfigParams, EMapSource } from '../../services/configparams.service';
import { MLConfig } from '../mlcomponents/libs/MLConfig';
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
import { AgogroupComponent } from "../../components/agogroup/agogroup";
import { AgoitemComponent } from "../../components/agoitem/agoitem";
import { MapopenerProvider } from "../../providers/mapopener/mapopener";
import { MapLocOptions, MapLocCoords } from '../../services/positionupdate.interface';
import { MLBounds } from '../../services/mlbounds.service';

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
    private mapHosterDict : Map<string, any> = new Map<string, any>([
        ['google', MultiCanvasGoogle],
        ['esri', MultiCanvasEsri],
        ['leaflet', MultiCanvasLeaflet]
    ]);

  constructor( private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
              private slideshareService : SlideShareService, pageService : PageService,
              private slideViewService : SlideViewService, private modalCtrl : ModalController,
              private mapOpener : MapopenerProvider) {
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
              console.log(data);
              let xtnt : __esri.Extent = data.defaultExtent;
              let xcntr : __esri.Point = xtnt.center;
              let cntr : IPosition = new MLPosition(xcntr.longitude, xcntr.latitude, 15);
              let mplocCoords : MapLocCoords = {lat: xcntr.latitude, lng: xcntr.longitude};
              let mploc : MapLocOptions = {center: mplocCoords, zoom: 15, places: null};
              let bnds : MLBounds = new MLBounds(xtnt.xmin, xtnt.ymin, xtnt.xmax, xtnt.ymax);
              let mlcfg = new MLConfig({mapId : -1, mapType : 'esri', webmapId : data.id,
                mlposition : cntr, source : EMapSource.srcagonline});
              mlcfg.setBounds(bnds);
              this.addCanvas('esri', mlcfg, mploc);

          });
          modal.present();
        },
        'Sharing Instructions' : () => {
            this.showSharingHelp();
        },
        'Share Map' : () => {
            this.showSharing();
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');
  }
  showUsing() {
      console.log('show using');
  }
  showLocate() {
      console.log('show locate');
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
