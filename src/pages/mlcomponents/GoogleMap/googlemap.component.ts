import { Component, Output, EventEmitter, OnInit, NgZone, ViewChild } from '@angular/core';
import { AgmMap, MouseEvent } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { Geolocation } from '@ionic-native/geolocation';
import { MapInstanceService} from '../../../services/MapInstanceService';
import { MLConfig } from '../libs/MLConfig';
import { MLBounds } from '../../../services/mlbounds.service';

// import { PlacesSearch } from '../PlacesSearch/places.component';

@Component({
  selector: 'maplinkr-googlemap',
  templateUrl: './googlemap.component.html',
  // styles: [ './googlemap.component.css']
})
export class GoogleMapComponent implements OnInit {
  // @ViewChild(AgmMap)
  // private agmMap;
  @Output()
  viewCreated = new EventEmitter();
  private gmap: GoogleMap;
  private glat: number;
  private glng: number;
  private zoom: number;
  // private map: GoogleMap;
  private mlconfig : MLConfig;
  private mlconfigSet : boolean = false;
  // private places : PlacesSearch;

  constructor(
      ngZone : NgZone, private mapInstanceService: MapInstanceService,
      public geolocation : Geolocation) {

      console.log("ctor");
      this.geolocation.getCurrentPosition().then((position) => {

      // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.glat = position.coords.latitude;
      this.glng = position.coords.longitude;
      console.log("geolocation center at " + this.glng + ", " + this.glat);

      }, (err) => {
          console.log(err);
      });
  }

  ngAfterViewInit(){/*
    const mapRef : google.maps.Map = null;
  	this.agmMap.mapReady.subscribe(map => {
      console.log("get corners");
      // map.getNativeMap()
      // .then(map => console.log('map: ', map))
      // .catch(error => console.log('getNativeMap() Error: ', error));
    let bnds = map.getBounds();
      console.log('bounds: ', bnds);
      // .catch(error => console.log('getBounds() Error: ', error));
      let ne = bnds.getNorthEast();
      console.log(ne);

      // map.getBounds()
      //   .then((bounds) => {
      //       console.log(bounds);
      //       return bounds;
      //     },
      //     (err) => console.error(err)
      //   ).
      //   then((bounds) => bounds.getNorthEast()
      //         .then((ne) => console.log(ne),
      //         (err) => console.error(err))
      //   );
      // console.log(map.getBounds().getNorthEast());
      // console.log(map.getBounds().getSouthWest());
  	});*/
  }

  onMapReady(map: GoogleMap) {
      this.gmap = map;
      // let ndx = this.mapInstanceService.getSlideCount();
      // let mlcfg = this.mapInstanceService.getConfigForMap(ndx);
      // mlcfg.setRawMap(map);
      // console.log(this.map);

  }
  onBoundsChange($event) {
      console.log("boundsChange");
      if (!this.mlconfigSet) {
          this.mlconfigSet = true;
          let ndx = this.mapInstanceService.getSlideCount();
          this.mlconfig = this.mapInstanceService.getConfigForMap(ndx - 1);
          this.mlconfig.setRawMap(this.gmap);
          this.addCenterMarker();
      }
      let mp = this.gmap;

      this.mlconfig.setBounds(new MLBounds(mp.getBounds().getSouthWest().lng(),
                               mp.getBounds().getSouthWest().lat(),
                               mp.getBounds().getNorthEast().lng(),
                               mp.getBounds().getNorthEast().lat()));
  }
  ngOnInit() {
    console.log("ngOnInit");
    this.zoom = 14;

    // initial center position for the map
    // this.glat = 41.888941;
    // this.glng = -87.620692;
    console.log('OnInit');
      /*
      this.map_.getNativeMap()
        .then(map => console.log('OnInit: map: ', map))
        .catch(error => console.log('OnInit: getNativeMap() Error: ', error));
      this.map_.getBounds()
        .then(bounds => console.log('OnInit: bounds: ', bounds))
        .catch(error => console.log('OnInit: getBounds() Error: ', error));
    let bnds = this.map_.getBounds(); //.getNativeMap().getBounds();
    console.log(bnds);

    // this.places = new PlacesSearch(this.elementRef.nativeElement);
    */
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  addInfoWindow(marker, content){
      let infoWindow = new google.maps.InfoWindow({
          content: content
      });

      google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.mlconfig.getRawMap(), marker);
      });
  }
  addCenterMarker(){
    // var mp : GoogleMap = this.mlconfig.getRawMap();
    // console.log("addMarker center at " + mp.getCenter().lng() + ", " + mp.getCenter().lat());
    // console.log("addMarker center at " + position.coords.longitude + ", " + position.coords.glatitude);
    let pos = {lat: this.glat, lng: this.glng, label: 'C'};
    let marker = new google.maps.Marker({
      map: this.mlconfig.getRawMap(),
      animation: google.maps.Animation.DROP,
      position: pos,
      draggable: false
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }
  markers: marker[] = [
	  {
		  lat: 41.888941,
		  lng: -87.620692,
		  label: 'A',
		  draggable: true
	  } /*,
	  {
		  lat: 51.373858,
		  lng: 7.215982,
		  label: 'B',
		  draggable: false
	  },
	  {
		  lat: 51.723858,
		  lng: 7.895982,
		  label: 'C',
		  draggable: true
	  }*/
  ]
}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
