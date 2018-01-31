import { Injectable } from '@angular/core';

// import Map = require('esri/Map');
import { loadModules } from 'esri-loader';

@Injectable()
export class ESRIMapService {
  map : any;
  constructor() {
  }
  async  getGeo() {
  // Load the mapping API modules
      return loadModules([
        'esri/Map'
      ]).then(([Map]) => {
      let map = new Map({
        basemap: <any>'topo-vector'
      });
    });
  }
}
