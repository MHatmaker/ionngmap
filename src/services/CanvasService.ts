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
interface ICoords {
  latitude : number;
  longitude : number;
}

@Injectable()
export class CanvasService {
    private ndx : number;
    private canvases : Array<any> = new Array<any>();
    private outerMapNumber : number = 0;
    private selectedMapType : string;
    private initialLoc : MapLocOptions = {center : {lat : -1, lng : -1}, zoom : 15, places : null, query : ""};
    private currentLoc : MapLocOptions = {center : {lat : -1, lng : -1}, zoom : 15, places : null, query : ""};;
    private glongitude : number;
    private glatitude : number;
    private isApp : boolean = true;
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

    geoSuccess(position) : any  {
        this.initialLoc.center.lat = position.coords.latitude;
        this.initialLoc.center.lng = position.coords.longitude;
    }
    setPlatform(pltfrm : boolean) {
      this.isApp = pltfrm;
    }

    public async getCurrentLocationBrowser()  : Promise<{coords : ICoords}>{

      let options = {timeout: 10000, enableHighAccuracy: false};
      return await new Promise<{coords : ICoords}>(async (resolve, reject) => {
        await navigator.geolocation.getCurrentPosition(resolve, reject, options)
      });
    }

    public getCurrentLocation(isInitial : boolean = true) {
      console.log('getCurrentLocation');
      let options = {timeout: 10000, enableHighAccuracy: false};
        this.geoLocation.getCurrentPosition(options).then((position) =>
        {
          if(isInitial) {
              this.initialLoc.center.lat = position.coords.latitude;
              this.initialLoc.center.lng = position.coords.longitude;
          } else {

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
          let maphoster = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
          maphoster.setCurrentLocation(this.currentLoc);
        }
      });
    }


    awaitInitialLocation = async () => {
      if(this.isApp) {
          await this.getCurrentLocation(true);
          this.initialLoc = this.currentLoc;
      } else {

          const {coords} = await this.getCurrentLocationBrowser();
          console.log(coords);
          const {latitude, longitude} = coords;
          console.log(coords);
          this.initialLoc.center.lng = longitude;
          this.initialLoc.center.lat = latitude;
          // this.initialLoc = this.currentLoc;
          console.log(`lng ${this.initialLoc.center.lng}, lat ${this.initialLoc.center.lat}`);
      }
      // let maphoster = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
      // maphoster.setCurrentLocation(this.currentLoc);
    }
    awaitCurrentLocation = async () => {
        if(this.isApp) {
          await this.getCurrentLocation();
          console.log(`lng ${this.initialLoc.center.lng}, lat ${this.initialLoc.center.lat}`);
          // this.initialLoc = this.currentLoc;
      } else {
        try {
          console.log('call getCurrentLocationBrowser');
          const {coords} = await this.getCurrentLocationBrowser();
          console.log(coords);
          const {latitude, longitude} = coords;
          console.log(coords);
          this.initialLoc.center.lng = longitude;
          this.initialLoc.center.lat = latitude;
          // this.initialLoc = this.currentLoc;
          console.log(`lng ${this.initialLoc.center.lng}, lat ${this.initialLoc.center.lat}`);
        } catch(err) {
          console.log('timeout on geoLocation');
          console.error(err);
        }
      }
      // let maphoster = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
      // maphoster.setCurrentLocation(this.currentLoc);
    }

    getIndex () {
        return this.ndx;
    }
    getInitialLocation() : MapLocOptions {
        return this.initialLoc;
    }

  setInitialLocation(maplocOpts : MapLocOptions) {
    this.initialLoc = maplocOpts;
    // this.initialLoc.center = maplocOpts.center;
    // this.initialLoc.zoom = 15;
    // this.initialLoc.query = maplocOpts.query;
    // this.initialLoc.places = maplocOpts.places;
  }

  async addInitialCanvas(userName : string) {
        // await this.awaitInitialLocation();
        if(userName == "") {
          userName = this.pusherConfig.getUserName();
        }
        let bnds : MLBounds = null;
        // let opts : MapLocOptions = this.initialLoc;
        let shr : IMapShare = {mapLocOpts : this.initialLoc, userName : userName, mlBounds : bnds,
            source : EMapSource.urlgoogle, webmapId : 'nowebmap'};
        console.log(`geolocation center at ${this.glongitude}, ${this.glatitude}`);
        this.mapOpener.openMap.emit(shr);
  }

  addCanvas (mapType, mapTypeToCreate, source, mlcfg, maploc)  : HTMLElement{
      console.log("in canvasService.addCanvas");
      console.log(`mapType : ${mapType}`);
      console.log(mapTypeToCreate);
      let currIndex : number = this.mapInstanceService.getNextSlideNumber(),
          appendedElem : HTMLElement,
          mlConfig;
      if (mlcfg) {
          mlConfig = mlcfg;
      } else {
          // this might not be used
          if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
              console.log(`hasConfigInstanceForMap for index ${currIndex} is false`);
              let ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
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

      this.ndx = currIndex;
      appendedElem = this.appendNewCanvasToContainer(mapTypeToCreate);

      console.log(`now incrementMapNumber from index ${currIndex}`);
      this.mapInstanceService.incrementMapNumber();
      this.mapInstanceService.setCurrentSlide(currIndex);
      this.slideshareService.slideData.emit({
                  mapListElement: appendedElem,
                  slideNumber: currIndex,
                  mapName: "Map " + currIndex
              });
      return appendedElem;
  }


    appendNewCanvasToContainer(component : any) : HTMLElement {
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
