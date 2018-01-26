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
import { IPosition, MLPosition } from '../services/position.service';
import { ConfigParams, IConfigParams } from '../services/configparams.service';
import { MLConfig } from '../libs/MLConfig';
import { MapInstanceService} from '../services/MapInstanceService';
import { CarouselComponent} from '../Carousel/carousel.component';
import { MultiCanvasEsri } from '../MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../MultiCanvas/multicanvasgoogle.component';
import { CanvasService } from '../services/CanvasService';
import { ISlideData } from "../services/slidedata.interface";
import { SlideShareService } from '../services/slideshare.service';

declare var google;

console.log("loading CanvasHolder");

@Component({
  selector: 'canvas-holder',
  providers: [MapInstanceService, CanvasService, SlideShareService],
  // providers: [MapInstanceService, CanvasService, MLPosition, ConfigParams, MLConfig, SlideShareService],
  template: require('./canvasholder.component.html'),
  styles: [require('./canvasholder.component.css')]
})
export class CanvasHolderComponent {
    private isInstantiated : boolean;
    private outerMapNumber : number = 0;

    // @ViewChild('placeHolder', {read: ViewContainerRef}) private _placeHolder: ViewContainerRef;

    constructor (private mapInstanceService : MapInstanceService, private canvasService : CanvasService,
            private slideshareService : SlideShareService) {

        console.log("fire up ConfigParams");
        var ipos = <IPosition>{'lon' : 37.422858, "lat" : -122.085065, "zoom" : 15},
            cfgparams = <IConfigParams>{mapId : this.outerMapNumber, mapType : 'google', webmapId : "nowebmap", mlposition :ipos},
            mlconfig = new MLConfig(cfgparams);
        this.mapInstanceService.setConfigInstanceForMap(this.outerMapNumber, mlconfig);
    }
    sendMessage(): void {
            // send message to subscribers via observable subject
            console.log("Message from CanvasHolderComponent to CarouselComponent!");
            // this.messageService.sendMessage('Message from CanvasHolderComponent to CarouselComponent!');
        }
        /*
    public createComponent (vCref: ViewContainerRef, type: any): ComponentRef<any> {

        let factory = this._cmpFctryRslvr.resolveComponentFactory(type);

        // vCref is needed cause of that injector..
        let injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);

        // create component without adding it directly to the DOM
        let comp = factory.create(injector);

        return comp;
    }*/
    addCanvas (mapType, mlcfg, resolve) {
        console.log("in CanvasHolderCtrl.addCanvas");
        var currIndex = this.mapInstanceService.getSlideCount(),
            newCanvasItem,
            mapDctv,
            parentDiv,
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
        // this.broadcaster.broadcast('addslide', {
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

/*
                $scope.$on('selectMapTypeEvent', function (evt, data) {
                    console.log('CanvasHolderCtrl on selectMapTypeEvent');
                    console.debug(data);
                    $scope.addCanvas(data.mapType);
                });
                angular.element($window).bind('resize', function () {
                    $scope.$broadcast('CanvasHolderResizeEvt');
                });
                $scope.centerOnMe = function () {
                    console.log("centerOnMe");
                    var currentMapNumber = MapInstanceService.getCurrentSlide(),
                        currentMapInstance = MapInstanceService.getMapHosterInstance(currentMapNumber);
                    console.log("getCurrentSlide() returned " + currentMapNumber);
                    console.log("CanvasHolderCtrl.centerOnMe for map " + currentMapNumber);
                    currentMapInstance.centerOnMe();
                };
              }
        */
        /*
        function init() {
            console.log('CanvasHolderCtrl init');
            if (!isInstantiated) {
                var locApp = angular.module('mapModule');

                locApp.controller('CanvasHolderCtrl',  ['$scope', '$rootScope', '$timeout', '$uibModal', 'LinkrService', 'MapInstanceService', 'CanvasService', '$window', CanvasHolderCtrl]);
                // angular.bootstrap(document.getElementById('year'), ['example']);
                isInstantiated = true;
            }
        }*/
