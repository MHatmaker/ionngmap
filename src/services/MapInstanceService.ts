import {Injectable} from '@angular/core';
import { MLConfig } from '../pages/mlcomponents/libs/MLConfig';
// import { ConfigParams } from './configparams.service'

// interface IHash {
//     []
// }

@Injectable()
export class MapInstanceService {
    slideCount : 0;
    isFirstInstance : boolean;
    currentSlideNumber : number;
    configInstances : Map<string, MLConfig> = new Map<string, MLConfig>();

    constructor() {
        console.log("service to return slideCount");
        this.isFirstInstance = true;
        this.slideCount = 0;
        this.currentSlideNumber = 0;
        // this.configInstances = new MLConfig(new ConfigParams(-1, "", "", null));
    }

    getSlideCount() : number {
        return this.slideCount;
    }
    incrementMapNumber() : void {
        this.slideCount += 1;
        console.log("incrementMapNumber to " + this.slideCount);
    }
    getNextMapNumber() : number {
        if (this.isFirstInstance) {
            this.isFirstInstance = false;
        }
        return this.slideCount;
    }
    removeInstance(slideToRemove : number) : void {
        if (slideToRemove === this.slideCount - 1) {
            this.slideCount -= 1;
        }
    }
    setConfigInstanceForMap(ndx : number, cfg : MLConfig) {
        this.configInstances["cfg" + ndx] = cfg;
    }
    getConfigInstanceForMap(ndx : number) : MLConfig{
        return this.configInstances["cfg" + ndx];
    }
    hasConfigInstanceForMap(ndx : number) : boolean {
        var instname = 'cfg' + ndx,
            test = this.configInstances[instname] === null;
        console.log('hasConfigInstanceForMap for ' + instname);
        console.log("test " + test);

        return (this.configInstances['cfg' + ndx]) ? true : false;
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
    setMapHosterInstance(ndx : number, inst : MLConfig) {
        var cfgndx = "cfg" + ndx;
        this.configInstances[cfgndx].setMapHosterInstance(inst);
        // incrementMapNumber();
    }
    getMapHosterInstance(ndx : number) : MLConfig {
        return this.configInstances["cfg" + ndx].getMapHosterInstance();
    }
    getMapHosterInstanceForCurrentSlide() : MLConfig {
        return this.getMapHosterInstance(this.currentSlideNumber);
    }
}
