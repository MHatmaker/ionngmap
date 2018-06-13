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
        'esri/geometry/Point', 'esri/geometry/SpatialReference',
        'esri/tasks/Locator'
      ], options)
      .then(([esriPoint, SpatialReference, esriLocator]) => {
            this.esriPoint = esriPoint();
            this.geoLocator = new esriLocator({url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"});
            let mapOptions = {
              center: new esriPoint({
                x: -87.620692,
                y: 41.888941,
                spatialReference: SpatialReference({ wkid: 4326 })
              }),
              zoom: 15
            };
            this.geolocation.getCurrentPosition().then((position) => {

                // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.glat = position.coords.latitude;
                this.glng = position.coords.longitude;
                mapOptions.center.x = this.glng;
                mapOptions.center.y = this.glat;
                this.startup.configure('esri-map-component' + this.mapNumber, mapOptions, this.elementRef.nativeElement.firstChild);
              }
                /*
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
                this.mapView.when((instance) => {
                    console.log(`Centering map: ${this.mapNumber} at ${this.glng}, ${this.glat}`);
                    this.mapView.center = [this.glng, this.glat];

                    this.mapView.on('click', (evt) => {
                        evt.stopPropagation();
                        this.onMapClick(evt, this.mapView);
                    });
                });
                this.viewCreated.next(this.mapView);
            }*/
          )}
      )}
    onMapClick(e, mpView) {
                var mapPt = {x : e.mapPoint.x, y : e.mapPoint.y},
                    rawMapPt = e.mapPoint,
                    source = proj4.Proj('GOOGLE'),
                    dest =  proj4.Proj('WGS84'),
                    p,
                    cntrpt;
      loadModules([
        'esri/geometry/Point', 'esri/geometry/SpatialReference',
        'esri/geometry/support/webMercatorUtils'
      ])
      .then(([esriPoint, SpatialReference, esriwebMercatorUtils]) => {
                this.screenPt = e.screenPoint;
                console.log("e.screenPoint");
                console.debug(e.screenPoint);
                p = proj4.toPoint([e.mapPoint.x, e.mapPoint.y]);
                proj4.transform(source, dest, p);
                cntrpt = esriPoint({longitude : p.x, latitude : p.y, spatialReference : new SpatialReference({wkid: 4326})});
                console.log("clicked Pt " + mapPt.x + ", " + mapPt.y);
                console.log("converted Pt " + cntrpt.x + ", " + cntrpt.y);
                this.fixedLLG = this.utils.toFixedTwo(cntrpt.x, cntrpt.y, 3);
                let locPt = esriwebMercatorUtils.xyToLngLat(e.mapPoint.longitude, e.mapPoint.latitude);
                let locPt2 = new esriPoint({x: locPt[0], y: locPt[1]});
                this.geoLocator.locationToAddress(rawMapPt) //locPt2)
                .then(function(response) {
                    // var location;
                    console.log(response);
                    if (response.address) {
                        let address = response.address;
                        let location = esriwebMercatorUtils.lngLatToXY(response.location.longitude, response.location.latitude);
                        // this.showClickResult(address);
                        mpView.popup.content = address;
                        console.debug(location);
                    } else {
                        mpView.popup.content = "whoops";
                        // this.showClickResult(null);
                    }
                    mpView.popup.open({title: "Address", location: rawMapPt});

                }).otherwise(function(err) {
                    console.log(err);
                });
            });

    }
}
