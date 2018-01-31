import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    EventEmitter } from '@angular/core';
    // ViewContainerRef,
    // ComponentRef,
    // ReflectiveInjector,
    // ViewChild,
    // ElementRef,
    // ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IPosition, MLPosition } from '../../services/position.service';
import { ConfigParams, IConfigParams } from '../../services/configparams.service';
import { MLConfig } from '../mlcomponents/libs/MLConfig';
import { MapInstanceService} from '../../services/MapInstanceService';
import { CarouselComponent} from '../mlcomponents/Carousel/carousel.component';
import { MultiCanvasEsri } from '../mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../mlcomponents/MultiCanvas/multicanvasgoogle.component';
import { CanvasService } from '../../services/CanvasService';
import { ISlideData } from "../../services/slidedata.interface";
import { SlideShareService } from '../../services/slideshare.service';

declare var google;

@IonicPage()
@Component({
  selector: 'page-maps',
  providers: [MapInstanceService, CanvasService, SlideShareService],
  templateUrl: 'maps.html',
  styles: ['./canvasholder.component.css']
})
export class MapsPage {
  selectedMapType : string;
    private isInstantiated : boolean;
    private outerMapNumber : number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
              private slideshareService : SlideShareService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedMapType = navParams.get('title');

    console.log("fire up ConfigParams");
    var ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
        cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : 'google', webmapId : "nowebmap", mlposition :ipos},
        mlconfig = new MLConfig(cfgparams);
    this.mapInstanceService.setConfigInstanceForMap(this.outerMapNumber, mlconfig);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');
  }
  openPage(p) {
      console.log("selected map type " + p);
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
