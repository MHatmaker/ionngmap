import { Component, ElementRef, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ESRIMapService } from '../../../services/esrimap.service';
import { loadModules } from 'esri-loader';
import { Geolocation } from '@ionic-native/geolocation';
// import * as proj4 from 'proj4';
import { MapInstanceService} from '../../../services/MapInstanceService';
import { MLConfig } from '../libs/MLConfig';
import { ImlBounds, MLBounds } from '../../../services/mlbounds.service';
// import { SpatialReference } from 'esri/geometry';
// import { Geometry } from 'esri/geometry';
// import * as Geometry from 'esri/geometry';
// import { Point } from 'esri/geometry';
import { utils } from '../libs/utils';
import { StartupArcGIS } from '../libs/StartupArcGIS';
import { GeoPusherSupport } from '../libs/geopushersupport';

// import * as Locator from 'esri/tasks/Locator';
// import { webMercatorToGeographic, xyToLngLat, lngLatToXY } from 'esri/geometry/support/webMercatorUtils';

declare var proj4;

@Component({
  selector: 'maplinkr-esrimap',
  templateUrl: './esrimap.component.html'
})
export class EsriMapComponent implements OnInit {

  @Output()
  viewCreated = new EventEmitter();
  // @ViewChild('map') mapEl: ElementRef;
  //     mapView:any = null;
  private mapView: any;
  private glat : number;
  private glng : number;
  private mapNumber : number;
  private amap : any;
  private fixedLLG = null;
  private geoLocator : __esri.Locator;
  private esriPoint : __esri.Point;
  private screenPt : null;
  private startup : StartupArcGIS;
  private mlconfig : MLConfig;
  // private mlProj4 : any;

  constructor(private mapService: ESRIMapService, private geolocation : Geolocation,
      private mapInstanceService: MapInstanceService,
      private elementRef: ElementRef, private utils : utils, private geopush: GeoPusherSupport) {
      this.mapNumber = this.mapInstanceService.getSlideCount();
      this.startup = new StartupArcGIS(this.mapNumber,
          this.mapInstanceService.getConfigForMap(this.mapNumber), geopush);
  }

  ngOnInit() {
  // Load the mapping API modules
      const options = {
        url: 'https://js.arcgis.com/4.7/'
      };
      loadModules([
        'esri/geometry/Point', 'esri/geometry/SpatialReference'
      ], options)
      .then(([esriPoint, SpatialReference]) => {
            this.esriPoint = esriPoint();

            let mapOptions = {
              center: new esriPoint({
                x: -87.620692,
                y: 41.888941,
                spatialReference: SpatialReference({ wkid: 4326 })
              }),
              zoom: 15
            };
            this.startup.configure('esri-map-component' + this.mapNumber, mapOptions, this.elementRef.nativeElement.firstChild);

});
}}
