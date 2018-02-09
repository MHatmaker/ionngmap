import {
    Component,
    AfterViewInit} from '@angular/core';

import { IPosition, MLPosition } from '../../services/position.service';
import { IConfigParams } from '../../services/configparams.service';
import { MLConfig } from '../mlcomponents/libs/MLConfig';
import { MapInstanceService} from '../../services/MapInstanceService';
// import { CarouselComponent} from '../mlcomponents/Carousel/carousel.component';
import { MultiCanvasEsri } from '../mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../mlcomponents/MultiCanvas/multicanvasgoogle.component';
import { CanvasService } from '../../services/CanvasService';
// import { ISlideData } from "../../services/slidedata.interface";
import { SlideShareService } from '../../services/slideshare.service';
import { MenuOptionModel } from './../../side-menu-content/models/menu-option-model';
import { PageService } from "../../services/pageservice"

// declare var google;
// var mapInstanceService : MapInstanceService = new MapInstanceService();
// var canvasService : CanvasService; // = new CanvasService();
// var slideshareService : SlideShareService = new SlideShareService();

@Component({
  selector: 'page-maps',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.scss']
})
export class MapsPage implements AfterViewInit {
  selectedMapType : string;
    // private isInstantiated : boolean = false;
    private outerMapNumber : number = 0;
    private mlconfig : MLConfig;

  constructor( private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
              private slideshareService : SlideShareService, pageService : PageService) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.selectedMapType = navParams.subItems.length == 0 ?  'google' : navParams.subItems[0].displayName; //get('title');

    // if (this.isInstantiated) {
    //     this.outerMapNumber = mapInstanceService.getNextMapNumber();
    // }
    // this.isInstantiated = true;
    console.log("fire up ConfigParams");
    var ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
        cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : this.selectedMapType, webmapId : "nowebmap", mlposition :ipos},
        mlconfig = new MLConfig(cfgparams);
    mapInstanceService.setConfigInstanceForMap(this.outerMapNumber, mlconfig);
    pageService.menuOption.subscribe(
      (data: MenuOptionModel) => {
        console.log(data);
        if ( data.displayName === 'MapLinkr') {
            alert("MapLinkr!");
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
          newCanvasItem,
          appendedElem,
          mapTypeToCreate,
          newpos,
          icfg,
          mlConfig;
      if (mlcfg) {
          mlConfig = mlcfg;
      } else {
          if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
              newpos = new MLPosition(-1, -1, -1);
              icfg = <IConfigParams>{mapId : -1, mapType : 'unknown', webmapId : '', mlposition : newpos}
              mlConfig = new MLConfig(icfg);
              console.log("addCanvas with index " + currIndex);
              console.debug(mlConfig);
              mlConfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                  currIndex === 0 ? currIndex : currIndex - 1).getConfigParams());
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig); //angular.copy(mlConfig));
          }
      }
      // let cmp = this.createComponent(this._placeHolder, MultiCanvas);
      if (mapType === 'google') {
          mapTypeToCreate = MultiCanvasGoogle;
      } else if (mapType === 'esri') {
          mapTypeToCreate = MultiCanvasEsri;
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
