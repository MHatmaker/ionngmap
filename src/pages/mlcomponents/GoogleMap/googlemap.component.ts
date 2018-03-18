import { Component, Output, EventEmitter, OnInit, Renderer2, AfterViewInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { MapInstanceService} from '../../../services/MapInstanceService';
import { MLConfig } from '../libs/MLConfig';
import { MLBounds } from '../../../services/mlbounds.service';
import { StartupGoogle } from '../libs/StartupGoogle';
import { GeoPusherSupport } from '../libs/geopushersupport';

// import { PlacesSearch } from '../PlacesSearch/places.component';
declare var google;

@Component({
  selector: 'maplinkr-googlemap',
  templateUrl: './googlemap.component.html',
  styles : ['width: 100%; height: 450px']
  // styles: [ './googlemap.component.css']
})
export class GoogleMapComponent implements AfterViewInit, OnInit {
  @Output()
  viewCreated = new EventEmitter();
  private gmap: any;
  private mapNumber : number;
  private gmHeight : string = '550px';
  private glat: number;
  private glng: number;
  private zoom: number;
  private mlconfig : MLConfig;
  private mlconfigSet : boolean = false;
  private self = this;
  private startup : StartupGoogle;
  //private places : PlacesSearch;


  constructor(
      ngZone : NgZone, private mapInstanceService: MapInstanceService,
      public geolocation : Geolocation, public mapElement : ElementRef, private rndr : Renderer2,
      private geopush: GeoPusherSupport) {

      console.log("GoogleMapComponent ctor");
      this.mapNumber = this.mapInstanceService.getSlideCount();
      this.startup = new StartupGoogle(this.mapNumber,
          this.mapInstanceService.getConfigForMap(this.mapNumber), geopush);
  }

  ngAfterViewInit () {
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // let mapElement = this.mapElement.nativeElement;
    let mapElement = document.getElementById("google-map-component" + this.mapNumber);
    this.gmHeight = '550px';

    console.log(this.mapElement.nativeElement);
    console.log(document.getElementById("google-map-component" + this.mapNumber));
    this.geolocation.getCurrentPosition().then((position) => {

        // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.glat = position.coords.latitude;
        this.glng = position.coords.longitude;
        latLng = new google.maps.LatLng(this.glat, this.glng);
        mapOptions.center = {lng: this.glng, lat: this.glat};
        console.log(`geolocation center at ${this.glng}, ${this.glat}`);
        this.startup.configure("google-map-component" + this.mapNumber, mapElement, mapOptions);
        this.gmap = new google.maps.Map(mapElement, mapOptions);
        this.rndr.setAttribute(mapElement, "style", "height: 550px");
        this.addCenterMarker();

        this.gmap.addListener('click',  (evt)  => {
            console.log("click just happened");
            this.mapClicked(evt);
        });
        this.gmap.addListener('bounds_changed',  (evt) => {
          console.log("bounds_changed just happened");
            this.onBoundsChange(evt);
        });
        this.rndr.setAttribute(mapElement, "style", "height: 550px");

        }, (err) => {
            console.log(err);
        });
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.zoom = 14;
  }

  mapClicked = function (evt: any) {
    console.log(`mapClicked ${evt.latLng.lng()}, ${evt.latLng.lat()}`)
    let mrkr = new google.maps.Marker({
      position: evt.latLng,
      draggable: true,
      map : this.gmap,
      label : 'hi'
    });
    this.addInfoWindow(mrkr, "what is in here.")
  }
  onBoundsChange = function (evt) {
      console.log("boundsChange");
      if (!this.mlconfigSet) {
          this.mlconfigSet = true;
          let ndx = this.mapInstanceService.getSlideCount();
          this.mlconfig = this.mapInstanceService.getConfigForMap(ndx - 1);
          this.mlconfig.setRawMap(this.gmap);
      }
      let mp = this.gmap;

      this.mlconfig.setBounds(new MLBounds(mp.getBounds().getSouthWest().lng(),
                               mp.getBounds().getSouthWest().lat(),
                               mp.getBounds().getNorthEast().lng(),
                               mp.getBounds().getNorthEast().lat()));
  }
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }


  markerDragEnd(m: marker, evt: MouseEvent) {
    console.log('dragEnd', m, evt);
  }
  addInfoWindow(marker, content){
      let infoWindow = new google.maps.InfoWindow({
          content: content
      });

      google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.gmap, marker);
      });
  }
  addCenterMarker(){
    let pos = {lat: this.glat, lng: this.glng, label: 'C'};
    let marker = new google.maps.Marker({
      map: this.gmap, // this.mlconfig.getRawMap(),
      animation: google.maps.Animation.DROP,
      position: pos,
      draggable: false,
      label: 'Me!'
    });

    let content = "<h4>Center of the world!</h4>";

    this.addInfoWindow(marker, content);

  }

}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
