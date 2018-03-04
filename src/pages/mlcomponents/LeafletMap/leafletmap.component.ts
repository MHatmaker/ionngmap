import { Component, Output, EventEmitter, AfterViewInit, NgZone } from '@angular/core';
import * as L from "leaflet";
import { Geolocation } from '@ionic-native/geolocation';
import { MapInstanceService} from '../../../services/MapInstanceService';
import { MLConfig } from '../libs/MLConfig';
import { ImlBounds, MLBounds } from '../../../services/mlbounds.service';

// import { PlacesSearch } from '../PlacesSearch/places.component';

interface ILeafletParams {
    zoomControl : boolean,
    center : [number, number],
    zoom : number,
    minZoom : number,
    maxZoom : number
}

@Component({
  selector: 'maplinkr-leafletmap',
  templateUrl: './leafletmap.component.html',
  styles: [ `.leafletMapComponent {
              width: 100%;
              height: 550px;
             }`]
})
export class LeafletMapComponent implements AfterViewInit {
  @Output()
  viewCreated = new EventEmitter();
  private mapNumber;
  private mlconfig : MLConfig;
  private mlconfigSet : boolean = false;
  private lmap: L.Map;
  private glat: number;
  private glng: number;

  private params : ILeafletParams = {
       zoomControl: true,
       center: [32.9866, -96.9271],  // I live in Carrollton, TX
       zoom: 15,
       minZoom: 4,
       maxZoom: 19
     };

  constructor (private mapInstanceService: MapInstanceService,
      public geolocation : Geolocation, ngZone : NgZone) {
      this.mapNumber = this.mapInstanceService.getSlideCount();
  }

  ngAfterViewInit () {
    this.geolocation.getCurrentPosition().then((position) => {

        // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.glat = position.coords.latitude;
        this.glng = position.coords.longitude;
      this.params.center = [this.glat, this.glng];
      this.lmap =  L.map('leaflet-map-component' + this.mapNumber, this.params);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(this.lmap);
      let mrkr = L.marker(this.params.center).addTo(this.lmap)
              .bindPopup(`You are at ${this.glng}, ${this.glat} `).openPopup();

      this.lmap.on('click', (e : L.LeafletMouseEvent) => {
          var lat = e.latlng.lat,
              lng = e.latlng.lng,
              marker = L.marker(e.latlng).addTo(this.lmap)
              .bindPopup(`You clicked at ${lng}, ${lat}`).openPopup();
      });
      this.lmap.on('moveend', (e) => {
          this.boundsChanged(e);
      });
    });
  }

  boundsChanged (e) {
      var lfltBounds = this.lmap.getBounds(),
          bnds : ImlBounds,
          ne : L.LatLng,
          sw : L.LatLng;
      console.debug(lfltBounds);
      if (!this.mlconfigSet) {
          this.mlconfigSet = true;
          let ndx = this.mapInstanceService.getSlideCount();
          this.mlconfig = this.mapInstanceService.getConfigForMap(ndx - 1);
          this.mlconfig.setRawMap(this.lmap);
          if (lfltBounds) {
              ne = lfltBounds.getNorthEast();
              sw = lfltBounds.getSouthWest();
              bnds = {'llx' : sw.lng, 'lly' : sw.lat,
                           'urx' : ne.lng, 'ury' : ne.lat};
              this.mlconfig.setBounds(bnds);
          }
      }
  }
}
