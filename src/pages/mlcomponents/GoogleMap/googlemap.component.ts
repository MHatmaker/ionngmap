import { Component, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
// import { PlacesSearch } from '../PlacesSearch/places.component';

@Component({
  selector: 'maplinkr-googlemap',
  template: require('./googlemap.component.html'),
  styles: [ require('./googlemap.component.css')]
})
export class GoogleMapComponent implements OnInit {
  @Output()
  viewCreated = new EventEmitter();
  private lat: number;
  private lng: number;
  private zoom: number;
  // private places : PlacesSearch;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    // google maps zoom level
    this.zoom = 14;

    // initial center position for the map
    this.lat = 41.888941;
    this.lng = -87.620692;

    // this.places = new PlacesSearch(this.elementRef.nativeElement);
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
