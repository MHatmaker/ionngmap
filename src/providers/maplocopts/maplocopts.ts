import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapLocCoords, MapLocOptions } from '../../services/positionupdate.interface';

// export interface MapLocCoords {
//     lat : number,
//     lng : number
// }
//
// export interface MapLocOptions {
//     center : MapLocCoords,
//     zoom : number
// }

@Injectable()
export class MaplocoptsProvider {
  private center : any;
  private zoom : number;

  constructor() { //public center : MapLocCoords, public zoom : number) {
  }

  getCenter() : MapLocCoords {
    return this.center;
  }
  getZoom() : number {
    return this.zoom;
  }
}
