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
      console.log("ESRIMapService getGeo async method");
      return loadModules([
        'esri/Map'
      ]).then(([Map]) => {
      console.log("ESRIMapService get new map");
      let map = new Map({
        basemap: <any>'topo-vector'
      });
    });
  }
}
