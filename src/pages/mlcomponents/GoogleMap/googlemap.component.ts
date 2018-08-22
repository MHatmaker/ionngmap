import { Component, Output, EventEmitter, OnInit, Renderer2, AfterViewInit, NgZone, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { MapInstanceService} from '../../../services/MapInstanceService';
import { MLConfig } from '../libs/MLConfig';
import { MLBounds } from '../../../services/mlbounds.service';
import { StartupGoogle } from '../libs/StartupGoogle';
import { GeoPusherSupport } from '../libs/geopushersupport';
import { SlideViewService } from '../../../services/slideview.service';
import { CanvasService } from '../../../services/CanvasService'

// import { PlacesSearch } from '../PlacesSearch/places.component';
declare var google;

@Component({
  selector: 'maplinkr-googlemap',
  templateUrl: './googlemap.component.html'
  // styles: [ './googlemap.component.css']
})
export class GoogleMapComponent implements AfterViewInit, OnInit {
  @Output()
  viewCreated = new EventEmitter();
  private gmap: any;
  private mapNumber : number;
  private gmHeight : string = '540px';
  private glat: number;
  private glng: number;
  private zoom: number;
  private mlconfig : MLConfig;
  private mlconfigSet : boolean = false;
  // private self = this;
  private startup : StartupGoogle;
  //private places : PlacesSearch;


  constructor(
      ngZone : NgZone, private mapInstanceService: MapInstanceService, private canvasService : CanvasService,
      public geolocation : Geolocation, public elementRef : ElementRef, private rndr : Renderer2,
      geopush: GeoPusherSupport, private slideViewService : SlideViewService) {

      console.log("GoogleMapComponent ctor");
      this.mapNumber = this.mapInstanceService.getSlideCount();
      this.startup = new StartupGoogle(this.mapNumber,
          this.mapInstanceService.getConfigForMap(this.mapNumber), geopush);
      this.gmHeight = slideViewService.getMapColHeight() + 'px';
  }

  ngAfterViewInit () {

    // this.gmHeight = '380px';
    var position;
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      places : null,
      query : ""
    };
    // let mapElement = this.mapElement.nativeElement;
    // let mapElement = document.getElementById("google-map-component" + this.mapNumber);
    // this.gmHeight = '370px';

    console.log(this.elementRef.nativeElement);
    console.log(document.getElementById("google-map-component" + this.mapNumber));

    //this.geolocation.getCurrentPosition().then((position) => {
    // let position = this.canvasService.getInitialLocation();
    let mlcfg = this.mapInstanceService.getConfigForMap(this.mapNumber);
    if (this.mapNumber == 0) {
      position = this.canvasService.getInitialLocation();
        this.glat = position.center.lat;
        this.glng = position.center.lng;
    } else {
      position = mlcfg.getPosition();
        this.glat = position.lat;
        this.glng = position.lon;
    }


        // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        latLng = new google.maps.LatLng(this.glat, this.glng);
        mapOptions.center = {lng: this.glng, lat: this.glat};
        console.log(`geolocation center at ${this.glng}, ${this.glat}`);
        // this.rndr.setAttribute(mapElement, "style", "height: 550px; position: relative; overflow: hidden;");
        this.startup.configure("google-map-component" + this.mapNumber, this.elementRef.nativeElement.firstChild, mapOptions);
        /*
        }, (err) => {
            console.log(err);
        });
      */
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.zoom = 14;
  }

  onBoundsChange = (evt) => {
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

  markerDragEnd(m: marker, evt: MouseEvent) {
    console.log('dragEnd', m, evt);
  }

}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
