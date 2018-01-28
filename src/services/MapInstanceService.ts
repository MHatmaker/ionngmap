import {Injectable} from '@angular/core';

@Injectable()
export class MapInstanceService {
    slideCount : 0;
    isFirstInstance : boolean;
    currentSlideNumber : number;
    configInstances : {};

    constructor() {
        console.log("service to return slideCount");
        this.isFirstInstance = true;
        this.slideCount = 0;
        this.currentSlideNumber = 0;
        this.configInstances = {};
    }

    getSlideCount() {
        return this.slideCount;
    }
    incrementMapNumber() {
        this.slideCount += 1;
    }
    getNextMapNumber() {
        if (this.isFirstInstance) {
            this.isFirstInstance = false;
        }
        return this.slideCount;
    }
    removeInstance(slideToRemove) {
        if (slideToRemove === this.slideCount - 1) {
            this.slideCount -= 1;
        }
    }
    setConfigInstanceForMap(ndx, cfg) {
        this.configInstances["cfg" + ndx] = cfg;
    }
    getConfigInstanceForMap(ndx) {
        return this.configInstances["cfg" + ndx];
    }
    hasConfigInstanceForMap(ndx) {
        var instname = 'cfg' + ndx,
            test = this.configInstances[instname] === null;
        console.log('hasConfigInstanceForMap for ' + instname);
        console.log("test " + test);

        return (this.configInstances['cfg' + ndx]) ? true : false;
    }
    setCurrentSlide(ndx) {
        this.currentSlideNumber = ndx;
    }
    getCurrentSlide() {
        return this.currentSlideNumber;
    }
    getConfigForMap(ndx) {
        return this.configInstances["cfg" + ndx];
    }
    setMapHosterInstance(ndx, inst) {
        var cfgndx = "cfg" + ndx;
        this.configInstances[cfgndx].setMapHosterInstance(inst);
        // incrementMapNumber();
    }
    getMapHosterInstance(ndx) {
        return this.configInstances["cfg" + ndx].getMapHosterInstance();
    }
    getMapHosterInstanceForCurrentSlide() {
        return this.getMapHosterInstance(this.currentSlideNumber);
    }
}
