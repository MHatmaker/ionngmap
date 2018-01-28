import { Injectable } from '@angular/core';

import Map = 'esri/Map');

@Injectable()
export class ESRIMapService {
  map: Map;
  constructor() {
    this.map = new Map({
      basemap: <any>'topo-vector'
    });
  }
}
