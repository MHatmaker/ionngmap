import { Injectable } from '@angular/core';

export interface ImlBounds {
    llx : number,
    lly : number,
    urx : number,
    ury : number
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
};
