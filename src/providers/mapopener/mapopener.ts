
import { Injectable,
         EventEmitter } from '@angular/core';
import { MapLocOptions, MapLocCoords, IMapShare } from '../../services/positionupdate.interface';
import { mlBounds } from '../../pages/mlcomponents/libs/mlBounds.interface';
import { EMapSource } from '../../services/configparams.service';

@Injectable()
export class MapopenerProvider implements IMapShare {
    openMap = new EventEmitter<IMapShare>();
    addHiddenCanvas = new EventEmitter<any>();
    center : MapLocCoords;
    zoom : number;
    places : any;
    query : string;
    mapLocOpts : MapLocOptions;
    userName : string;
    mlBounds : mlBounds;
    source : EMapSource;
    webmapId : string;

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
