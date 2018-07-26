import { Injectable } from '@angular/core';

export interface IPosition {
    lon : number;
    lat : number;
    zoom : number;
}

console.log("loading MLPosition");

@Injectable()
export class MLPosition implements IPosition {
    private initialLat : number;
    private initiallon : number;

    constructor( public lon : number,  public lat : number,  public zoom : number) {
    }
    setInitialPosition(lon : number, lat : number) {
      this.initiallon = lon;
      this.initialLat = lat;
    }
    getInitialPosition() : IPosition {
      return {lon : this.initiallon, lat : this.initialLat, zoom : 15};
    }
};
