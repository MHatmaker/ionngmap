import { Component, ElementRef, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ESRIMapService } from '../../../services/esrimap.service';
import { loadModules } from 'esri-loader';

// import * as MapView from 'esri/views/MapView';
// import * as Point  from 'esri/geometry/Point';
// import * as SpatialReference from 'esri/geometry/SpatialReference';

// import MapView = require('esri/views/MapView');
// import Point = require('esri/geometry/Point');
// import SpatialReference = require('esri/geometry/SpatialReference');

@Component({
  selector: 'maplinkr-esrimap',
  template: '<div id="viewDiv" style="width:100%; height: 510px;"><ng-content></ng-content></div>'
})
export class EsriMapComponent implements OnInit {

  @Output()
  viewCreated = new EventEmitter();
  @ViewChild('map') mapEl: ElementRef;
      mapView:any = null;
  // mapView: any;

  constructor(private mapService: ESRIMapService,
    private elementRef: ElementRef) { }

  ngOnInit() {


  // Load the mapping API modules
      loadModules([
        'esri/Map', 'esri/views/MapView', 'esri/geometry/Point', 'esri/geometry/SpatialReference'
      ]).then(([Map, MapView, Point, SpatialReference]) => {
      let map = new Map({
        basemap: <any>'topo-vector'
        });
      this.mapView = new MapView({
        container: this.elementRef.nativeElement.firstChild,
        map: map, //this.mapService.map,
        center: new Point({
          x: -87.620692,
          y: 41.888941,
          spatialReference: new SpatialReference({ wkid: 4326 })
        }),
        zoom: 15
      });
      this.viewCreated.next(this.mapView);
    }
  )}
}
