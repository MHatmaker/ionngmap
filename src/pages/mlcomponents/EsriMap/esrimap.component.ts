import { Component, ElementRef, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ESRIMapService } from '../../../services/esrimap.service';
import { loadModules } from 'esri-loader';
import { Geolocation } from '@ionic-native/geolocation';
import * as proj4 from 'proj4';
import { MapInstanceService} from '../../../services/MapInstanceService';
import { MLConfig } from '../libs/MLConfig';
import { ImlBounds, MLBounds } from '../../../services/mlbounds.service';
// import { SpatialReference } from 'esri/geometry';
// import { Geometry } from 'esri/geometry';
// import * as Geometry from 'esri/geometry';
// import { Point } from 'esri/geometry';
import { utils } from '../libs/utils';
// import * as Locator from 'esri/tasks/Locator';
// import { webMercatorToGeographic, xyToLngLat, lngLatToXY } from 'esri/geometry/support/webMercatorUtils';

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

  constructor(private mapService: ESRIMapService, private geolocation : Geolocation,
      private mapInstanceService: MapInstanceService,
      private elementRef: ElementRef, private utils : utils) {
      this.mapNumber = this.mapInstanceService.getSlideCount();
  }

  ngOnInit() {
  // Load the mapping API modules
      loadModules([
        'esri/WebMap', 'esri/views/MapView', 'esri/geometry/Point', 'esri/geometry/SpatialReference',
        'esri/tasks/Locator', 'esri/geometry/support/webMercatorUtils', 'esri/geometry/Geometry'
      ]).then(([WebMap, MapView, esriPoint, SpatialReference, esriLocator, esriwebMercatorUtils, esriGeometry]) => {
      // loadModules([
      //
      // ]).then(([]) => {
            this.esriPoint = esriPoint;
            this.geoLocator = new esriLocator({url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"});
            this.geolocation.getCurrentPosition().then((position) => {

                // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.glat = position.coords.latitude;
                this.glng = position.coords.longitude;
                let amap = new WebMap({
                  // basemap: <any>'topo-vector'
                  portalItem: { // autocasts as new PortalItem()
                    id: 'f2e9b762544945f390ca4ac3671cfa72'
                  }});
                this.mapView = new MapView({
                  container: this.elementRef.nativeElement.firstChild,
                  map: amap,
                  center: new esriPoint({
                    x: this.glng,
                    y: this.glat,
                    spatialReference: new SpatialReference({ wkid: 4326 })
                  }),
                  zoom: 15
                });
                if(this.mapView != null) {
                    console.log(`Centering map: ${this.mapNumber} at ${this.glng}, ${this.glat}`);
                    this.mapView.center = [this.glng, this.glat];

                    amap.on('click', (evt) => {
                        this.onMapClick(evt);
                    })
                  }
                this.viewCreated.next(this.mapView);
            }
          )}
      )}
    onMapClick(e) {
                var mapPt = {x : e.mapPoint.x, y : e.mapPoint.y},
                    source = proj4.Proj('GOOGLE'),
                    dest =  proj4.Proj('WGS84'),
                    p,
                    cntrpt;
                this.screenPt = e.screenPoint;
                console.log("e.screenPoint");
                console.debug(e.screenPoint);
                p = proj4.toPoint([e.mapPoint.x, e.mapPoint.y]);
                proj4.transform(source, dest, p);
                cntrpt = new __esri.Point({longitude : p.x, latitude : p.y, spatialReference : new __esri.SpatialReference({wkid: 4326})});
                console.log("clicked Pt " + mapPt.x + ", " + mapPt.y);
                console.log("converted Pt " + cntrpt.x + ", " + cntrpt.y);
                this.fixedLLG = this.utils.toFixedTwo(cntrpt.x, cntrpt.y, 3);
                let locPt = __esri.webMercatorUtils.xyToLngLat(e.mapPoint.longitude, e.mapPoint.latitude);
                let locPt2 = new __esri.Point({x: locPt[0], y: locPt[1]});
                this.geoLocator.locationToAddress(locPt2)
                .then(function(response) {
                    // var location;
                    if (response.address) {
                        let address = response.address;
                        let location = __esri.webMercatorUtils.lngLatToXY(response.location.longitude, response.location.latitude);
                        this.showClickResult(address);
                        console.debug(location);
                    } else {
                        this.showClickResult(null);
                    }

                }).otherwise(function(err) {

                });

    }
}
