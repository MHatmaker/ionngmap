import { Injectable } from '@angular/core';

export interface IPosition {
    lon : number;
    lat : number;
    zoom : number;
}

console.log("loading MLPosition");

@Injectable()
export class MLPosition implements IPosition {

    constructor( public lon : number,  public lat : number,  public zoom : number) {
    }
};
