import {
    Component,
    AfterViewInit} from '@angular/core';

import { IPosition } from '../../services/position.service';
import { IConfigParams } from '../../services/configparams.service';
import { MLConfig } from '../mlcomponents/libs/MLConfig';
import { MapInstanceService} from '../../services/MapInstanceService';
// import { CarouselComponent} from '../mlcomponents/Carousel/carousel.component';
import { MultiCanvasEsri } from '../mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../mlcomponents/MultiCanvas/multicanvasgoogle.component';
import { MultiCanvasLeaflet } from '../mlcomponents/MultiCanvas/multicanvasleaflet.component';
import { CanvasService } from '../../services/CanvasService';
// import { ISlideData } from "../../services/slidedata.interface";
import { SlideShareService } from '../../services/slideshare.service';
import { MenuOptionModel } from './../../side-menu-content/models/menu-option-model';
import { PageService } from "../../services/pageservice"


@Component({
  selector: 'page-maps',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.scss']
})
export class MapsPage implements AfterViewInit {
  selectedMapType : string;
    private outerMapNumber : number = 0;
    private mlconfig : MLConfig;

  constructor( private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
              private slideshareService : SlideShareService, pageService : PageService) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.selectedMapType = navParams.subItems.length == 0 ?  'google' : navParams.subItems[0].displayName; //get('title');

    console.log("fire up ConfigParams");
    var ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
        cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : this.selectedMapType, webmapId : "nowebmap", mlposition :ipos},
        mlconfig = new MLConfig(cfgparams);
    this.mlconfig = mlconfig;
    mapInstanceService.setConfigInstanceForMap(this.outerMapNumber, mlconfig);
    pageService.menuOption.subscribe(
      (data: MenuOptionModel) => {
        console.log(data);
        if ( data.displayName === 'MapLinkr') {
            // alert("MapLinkr!");
            let mp = this.mlconfig.getRawMap();
            let bnds = mp.getBounds();
            console.log(bnds);
        } else {
            this.onsetMap(data);
        }
      });
  }

  ngAfterViewInit() {
    // this.addCanvas(this.selectedMapType, this.mlconfig, null);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');
  }
  openPage(p) {
      console.log("selected map type " + p);
  }
  onsetMap (menuOption : MenuOptionModel) {
      this.addCanvas( menuOption.displayName, null, null);
  }

  addCanvas (mapType, mlcfg, resolve) {
      console.log("in CanvasHolderCtrl.addCanvas");
      var currIndex : number = this.mapInstanceService.getSlideCount(),
          appendedElem,
          mapTypeToCreate,
          mlConfig;
      if (mlcfg) {
          mlConfig = mlcfg;
      } else {
          if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
              var ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
                  cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : this.selectedMapType, webmapId : "nowebmap", mlposition :ipos},
                  mlconfig = new MLConfig(cfgparams);
              // newpos = new MLPosition(-1, -1, -1);
              // icfg = <IConfigParams>{mapId : -1, mapType : 'unknown', webmapId : '', mlposition : newpos}
              // mlConfig = new MLConfig(icfg);
              console.log("addCanvas with index " + currIndex);
              console.debug(mlConfig);
              mlconfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                  currIndex === 0 ? currIndex : currIndex - 1).getConfigParams());
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlconfig); //angular.copy(mlConfig));
          }
      }
      if (mapType === 'google') {
          mapTypeToCreate = MultiCanvasGoogle;
      } else if (mapType === 'esri') {
          mapTypeToCreate = MultiCanvasEsri;

      } else if (mapType === 'leaflet') {
          mapTypeToCreate = MultiCanvasLeaflet;
      }

      appendedElem = this.canvasService.appendNewCanvasToContainer(mapTypeToCreate, currIndex);

      this.mapInstanceService.incrementMapNumber();
      this.slideshareService.slideData.emit({
                  mapListItem: appendedElem,
                  slideNumber: currIndex,
                  mapName: "Map " + currIndex
              });
  }
  removeCanvas (clickedItem) {
      console.log("removeCanvas");
      console.debug(clickedItem);
      // MapInstanceService.removeInstance(CarouselCtrl.getCurrentSlideNumber());
      this.slideshareService.slideRemove.emit();
  }
}
