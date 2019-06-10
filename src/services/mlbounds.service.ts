import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

export interface ImlBounds {
    llx : number,
    lly : number,
    urx : number,
    ury : number,
    getCenter() : Promise<{x : number, y : number}>
};

export interface xtntParams  {
    'src' : string,
    'zoom' : number,
    'lon' : number,
    'lat' : number,
    'scale': number,
    'action': string
};

console.log("loading MLBounds");

@Injectable()
export class MLBounds implements ImlBounds {

    constructor( public llx : number,  public lly : number,  public urx : number, public ury : number) {
    }
    public async getCenter() : Promise<{x : number, y : number}> {
      const options = {
        url: 'https://js.arcgis.com/4.11/'
      };
      const [esriExtent, esriPoint] = await loadModules([
        'esri/geometry/Extent', 'esri/geometry/Point'
      ], options);
          let esriXtnt = new esriExtent({xmin : this.llx, ymin : this.lly, xmax : this.urx, ymax : this.ury});
          let esriCenter = esriXtnt.center;
          let x = esriCenter.x;
          let y = esriCenter.y;
          // let x = this.llx + 0.5 * (this.urx - this.llx);
          // let y = this.lly + 0.5 * (this.ury - this.lly);
          return {x, y};

    }
};
