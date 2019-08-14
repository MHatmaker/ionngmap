import {
    Injectable,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef,
    EventEmitter
    // ComponentRef
} from '@angular/core';
import { MapInstanceService } from './MapInstanceService';
import { SlideShareService } from './/slideshare.service';
import { SlideViewService } from './/slideview.service';
import { IPosition } from './position.service';
import { IConfigParams, EMapSource } from './/configparams.service';
import { MLConfig } from '../pages/mlcomponents/libs/MLConfig';
import { MultiCanvasEsri } from '../pages/mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../pages/mlcomponents/MultiCanvas/multicanvasgoogle.component';
import { MultiCanvasLeaflet } from '../pages/mlcomponents/MultiCanvas/multicanvasleaflet.component';
import { PusherConfig } from '../pages/mlcomponents/libs/PusherConfig';
import { Geolocation } from '@ionic-native/geolocation';
import { MapLocCoords, MapLocOptions, IMapShare } from './positionupdate.interface';
import { MapopenerProvider } from '../providers/mapopener/mapopener';
import { MLBounds, ImlBounds } from './mlbounds.service';

// import {MultiCanvasGoogle} from '../MultiCanvas/multicanvasgoogle.component';

@Injectable()
export class CanvasService {
    private ndx : number;
    private canvases : Array<any> = new Array<any>();
    private outerMapNumber : number = 0;
    private selectedMapType : string;
    private initialLoc : MapLocOptions;
    private currentLoc : MapLocOptions;
    private glongitude : number;
    private glatitude : number;
    setCurrent = new EventEmitter<number>();

    constructor (
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private mapInstanceService : MapInstanceService,
        private slideshareService : SlideShareService,
        private slideViewService : SlideViewService,
        private geoLocation : Geolocation,
        private mapOpener : MapopenerProvider,
        private pusherConfig : PusherConfig
      ){
        // this.awaitInitialLocation();
    // this.geoLocation.getCurrentPosition().then((position) => {
    //
    //     // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //     console.log(`geoLocate current position ${position.coords.longitude}, ${position.coords.latitude}`);
    //     let glat = position.coords.latitude;
    //     let glng = position.coords.longitude;
    //     this.glatitude = glat;
    //     this.glongitude = glng;
    //     let latLng = new google.maps.LatLng(glat, glng);
    //     this.initialLoc = {
    //       center: {'lng' : glng, 'lat' : glat},
    //       zoom: 15,
    //       places : null,
    //       query : ""
    //       //mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };
    //   }).catch( (err) => {
    //         console.log(`geoLocation getCurrentPosition error ${err}`);
    //   });
    }

    getCurrentLocation() : any {
      console.log('getCurrentLocation');
      //this.geoLocation.getCurrentPosition().then((position) => {
      return new Promise((resolve, reject) => {
        this.geoLocation.getCurrentPosition();
      })
/*
          console.log(`geoLocate current position ${position.coords.longitude}, ${position.coords.latitude}`);
          // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          let glat = position.coords.latitude;
          let glng = position.coords.longitude;
          let latLng = new google.maps.LatLng(glat, glng);
          this.currentLoc = {
            center: {'lng' : glng, 'lat' : glat},
            zoom: 15,
            places : null,
            query : ""
            //mapTypeId: google.maps.MapTypeId.ROADMAP
          };
        }).catch((err) => {
          console.log(`geoLocate getCurrentPosition error ${err}`);
        });*/
    }

    awaitInitialLocation = async () => {
        const {coords} = await this.getCurrentLocation();
        this.initialLoc = this.currentLoc;
    }
    awaitCurrentLocation = async () => {
        await this.getCurrentLocation();
        let maphoster = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
        maphoster.setCurrentLocation(this.currentLoc);
    }

    getIndex () {
        return this.ndx;
    }
    getInitialLocation() : MapLocOptions {
        return this.initialLoc;
    }

  async addInitialCanvas(userName : string) {
        await this.awaitInitialLocation();
        let bnds : MLBounds = null;
        let opts : MapLocOptions = this.initialLoc;
        let shr : IMapShare = {mapLocOpts : opts, userName : userName, mlBounds : bnds,
            source : EMapSource.urlgoogle, webmapId : 'nowebmap'};
        console.log(`geolocation center at ${this.glongitude}, ${this.glatitude}`);
        this.mapOpener.openMap.emit(shr);
  }

  addCanvas (mapType, mapTypeToCreate, source, mlcfg, maploc)  : HTMLElement{
      console.log("in CanvasHolderCtrl.addCanvas");
      console.log(`mapType : ${mapType}`);
      console.log(mapTypeToCreate);
      var currIndex : number = this.mapInstanceService.getSlideCount(),
          appendedElem : HTMLElement,
          mlConfig;
      if (mlcfg) {
          mlConfig = mlcfg;
      } else {
          // this might not be used
          if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
              console.log(`hasConfigInstanceForMap for index ${currIndex} is false`);
              var ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
                  cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : this.selectedMapType,
                        webmapId : "nowebmap", mlposition :ipos, source : source},
                  mlconfig = new MLConfig(cfgparams);
                  mlconfig.setHardInitialized(true);
              // newpos = new MLPosition(-1, -1, -1);
              // icfg = <IConfigParams>{mapId : -1, mapType : 'unknown', webmapId : '', mlposition : newpos}
              // mlConfig = new MLConfig(icfg);
              console.log("addCanvas with index " + currIndex);
              console.debug(mlConfig);
              mlconfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                  currIndex === 0 ? currIndex : currIndex - 1).getConfigParams());
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlconfig); //angular.copy(mlConfig));
          } else {
              console.log(`getConfigForMap for current index ${currIndex}`);
              let mlcfg = this.mapInstanceService.getConfigForMap(currIndex > 0? currIndex - 1 : 0);
              let ipos = mlcfg.getPosition();
              mlcfg.setPosition(ipos);
          }
      }

      appendedElem = this.appendNewCanvasToContainer(mapTypeToCreate, currIndex);

      console.log(`now incrementMapNumber from index ${currIndex}`);
      this.mapInstanceService.incrementMapNumber();
      this.mapInstanceService.setCurrentSlide(currIndex);
      this.slideshareService.slideData.emit({
                  mapListItem: appendedElem,
                  slideNumber: currIndex,
                  mapName: "Map " + currIndex
              });
      return appendedElem;
  }


    appendNewCanvasToContainer(component : any, ndx : number) : HTMLElement {
        this.ndx = ndx;
        this.canvases.push(component);
        var mapParent = document.getElementsByClassName('mapcontent')[0];
        // Create a component reference from the component
        const componentRef = this.componentFactoryResolver
          .resolveComponentFactory(component)
          .create(this.injector);

        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;

        // Append DOM element to the body
        mapParent.appendChild(domElem);
        return domElem;
    }
    /*
    makeCanvasSlideListItem (ndx) {
        var newCanvasItem = document.createElement('li');
        newCanvasItem.id = "slide" + ndx;
        return newCanvasItem;
    }
    loadCanvasSlideListItem (elem, ndx) {
        this.canvases.push(new MultiCanvas.Canvas(elem, ndx));
        this.canvases[this.canvases.length - 1].init();
    }
    */
    getCanvasSlideListItem (ndx) {
        return this.canvases[ndx];
    };

}
