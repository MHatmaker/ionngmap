
import { Injectable,
         EventEmitter } from '@angular/core';
import { MapLocOptions, MapLocCoords } from '../../services/positionupdate.interface';

@Injectable()
export class MapopenerProvider implements MapLocOptions {
    openMap = new EventEmitter<MapLocOptions>();
    center : MapLocCoords;
    zoom : number;
    places : any;
    mapLocOpts : MapLocOptions;

  // constructor(private mapLocOpts : MapLocOptions) {
  // }

  constructor() {
  }
  getCenter() : MapLocCoords {
    return this.mapLocOpts.center;
  }
  getZoom() : number {
    return this.mapLocOpts.zoom;
  }

}
