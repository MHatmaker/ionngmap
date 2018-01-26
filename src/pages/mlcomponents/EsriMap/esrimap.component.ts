import { Component, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ESRIMapService } from '../services/esrimap.service';

import MapView = require('esri/views/MapView');
import Point = require('esri/geometry/Point');
import SpatialReference = require('esri/geometry/SpatialReference');

@Component({
  selector: 'maplinkr-esrimap',
  template: '<div id="viewDiv" style="height:100%"><ng-content></ng-content></div>'
})
export class EsriMapComponent implements OnInit {

  @Output()
  viewCreated = new EventEmitter();

  mapView: MapView;

  constructor(private mapService: ESRIMapService,
    private elementRef: ElementRef) { }

  ngOnInit() {
    this.mapView = new MapView({
      container: this.elementRef.nativeElement.firstChild,
      map: this.mapService.map,
      center: new Point({
        x: -87.620692,
        y: 41.888941,
        spatialReference: new SpatialReference({ wkid: 4326 })
      }),
      zoom: 15
    });
    this.viewCreated.next(this.mapView);
  }
}
