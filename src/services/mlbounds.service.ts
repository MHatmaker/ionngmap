import { Injectable } from '@angular/core';

export interface ImlBounds {
    llx : number,
    lly : number,
    urx : number,
    ury : number,
    getCenter() : {x : number, y : number}
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
    public getCenter() : {x : number, y : number}{
      let x = this.llx + 0.5 * (this.urx - this.llx);
      let y = this.lly + 0.5 * (this.ury - this.lly);
      return {x, y};
    }
};
