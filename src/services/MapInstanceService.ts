import {Injectable} from '@angular/core';
import { MLConfig } from '../pages/mlcomponents/libs/MLConfig';
import { MapHoster } from '../pages/mlcomponents/libs/MapHoster';
// import { ConfigParams } from './configparams.service'

// interface IHash {
//     []
// }

@Injectable()
export class MapInstanceService {
    nextSlideNumber : number = 0;
    isFirstInstance : boolean = true;
    currentSlideNumber : number = 0;
    configInstances : Map<string, MLConfig> = new Map<string, MLConfig>();
    mapHosterInstances : Map<string, MapHoster> = new Map<string, MapHoster>();
    hiddenMap : any;

    constructor() {
        console.log("service to return nextSlideNumber");
        // this.isFirstInstance = true;
        // this.nextSlideNumber = 0;
        // this.currentSlideNumber = 0;
        // this.configInstances = new MLConfig(new ConfigParams(-1, "", "", null));
    }

    getNextSlideNumber() : number {
        return this.nextSlideNumber;
    }
    incrementMapNumber() : void {
        this.nextSlideNumber += 1;
        console.log("incrementMapNumber nextSlideNumber to " + this.nextSlideNumber);
    }
    getNextMapNumber() : number {
        if (this.isFirstInstance) {
            this.isFirstInstance = false;
        }
        return this.nextSlideNumber;
    }
    removeInstance(slideToRemove : number) : void {
        if (slideToRemove === this.nextSlideNumber - 1) {
            this.nextSlideNumber -= 1;
        }
    }
    setConfigInstanceForMap(ndx : number, cfg : MLConfig) {
        this.configInstances["cfg" + ndx] = cfg;
    }
    getConfigInstanceForMap(ndx : number) : MLConfig{
        return this.configInstances["cfg" + ndx];
    }
    hasConfigInstanceForMap(ndx : number) : boolean {
        let instname = 'cfg' + ndx,
            test = this.configInstances[instname] === null;
        console.log('hasConfigInstanceForMap for ' + instname);
        console.log("test " + test);

        return (this.configInstances[instname]) ? true : false;
    }
    setCurrentSlide(ndx : number) : void {
        this.currentSlideNumber = ndx;
    }
    getCurrentSlide() : number {
        return this.currentSlideNumber;
    }
    getConfigForMap(ndx : number) : MLConfig {
        return this.configInstances["cfg" + ndx];
    }
    setMapHosterInstance(ndx : number, inst : MapHoster) {
        let cfgndx = "cfg" + ndx;
        this.mapHosterInstances[cfgndx] = inst; //setMapHosterInstance(inst);
        // incrementMapNumber();
    }
    getMapHosterInstance(ndx : number) : MapHoster {
        return this.mapHosterInstances["cfg" + ndx]; //.getMapHosterInstance();
    }
    getMapHosterInstanceForCurrentSlide() : MapHoster {
        return this.mapHosterInstances['cfg' + this.currentSlideNumber]; //getMapHosterInstance(this.currentSlideNumber);
    }
    setHiddenMap(map : any) {
        this.hiddenMap = map;
    }
    getHiddenMap() {
        return this.hiddenMap;
    }
}
