import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import * as L from "leaflet";
// import { Map } from 'leaflet';
// import { Geolocation } from '@ionic-native/geolocation';
// import { MapInstanceService} from '../../../services/MapInstanceService';
// import { MLConfig } from '../libs/MLConfig';
// import { ImlBounds, MLBounds } from '../../../services/mlbounds.service';

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
  template: '<div id="leaflet-map-component" class="leafletMapComponent"></div>',
  styles: [ `.leafletMapComponent {
              width: 600px;
              height: 400px;
             }`]
})
export class LeafletMapComponent implements OnInit {
  // @ViewChild(AgmMap)
  // private agmMap;
  @Output()
  viewCreated = new EventEmitter();
  private lmap: L.Map;
  private params : ILeafletParams = {
       zoomControl: true,
       center: [32.9866, -96.9271],  // I live in Carrollton, TX
       zoom: 12,
       minZoom: 4,
       maxZoom: 19
     };

  constructor () {
  }

  // ionViewDidLoad() {
  //     this.lmap =  L.map('leaflet-map-component', this.params);
  //     L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(this.lmap);
  // }
  ngOnInit () {
      this.lmap =  L.map('leaflet-map-component', this.params);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(this.lmap);
  }
}
