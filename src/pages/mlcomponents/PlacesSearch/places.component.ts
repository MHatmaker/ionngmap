
// import {} from 'google';
import { Component, NgZone, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
// import {FormsModule} from '@angular/forms'
// import { Map } from '@agm/core';
// import {} from '@types/googlemaps';
// import { MouseEvent } from '@agm/core';
import { MapInstanceService } from '../../../services/MapInstanceService';
import 'rxjs/add/operator/toPromise';

declare var google;

@Component({
  selector: 'places-for-maplinkr',
  templateUrl: './places.component.html',
  styles: [ './places.component.css']
  // template: require('./places.component.html'),
  // styles: [require('./places.component.css')]
})
export class PlacesSearchComponent implements AfterViewInit {
    // @ViewChild("searchBox")
    // searchBoxRef: ElementRef;
    input: any;
    searchBox: any;

  // constructor(private map : google.maps.Map, private _ngZone: NgZone)
  constructor(private _ngZone: NgZone, private mapInstanceService : MapInstanceService) {

  }

  handleError(error) {
      console.log(error);
  }

  async placesAsync() : Promise<google.maps.places.PlaceResult[]> {
      try {
         console.log('ready to getPlaces in placesAsync');
         let response = await this.searchBox.getPlaces(); //.toPromise();
         return response; //json().data as google.maps.places.PlaceResult[];
      } catch (error) {
          await this.handleError(error);
      }
      /*
      return await new Promise((resolve, reject) => {
          try {
              let places = this.searchBox.getPlaces().toPromise();
              if (!places) Promise.reject;
              return places.json().data;
              // Promise.resolve(places);
              // return places;
          } catch(ex) {
              Promise.reject(ex);
              return ex();
          }
      })
      */
  }
  ngAfterViewInit() {
      // this.input = this.searchBoxRef.nativeElement;
      this.input = document.getElementById('searchBox');
      // console.log(this.searchBoxRef);
//
      this.searchBox = new google.maps.places.SearchBox(this.input);
      this.searchBox.addListener("places_changed", () => {
          var places = [],
              queryPlaces = {'bounds' : google.maps.LatLngBounds, 'location': google.maps.LatLng, 'query': String};
        // this._ngZone.run(() => {
          console.log('listening');
          console.log(this.searchBox);
          let mph = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
          mph.setSearchBox(this.searchBox);
          let mphmap = mph.getMap();
          let bnds = mph.getSearchBounds();
          console.log("latest bounds");
          console.debug(bnds);
          // this.searchBox.setBounds(bnds);
          // mphmap.addListener('bounds_changed', () => searchBox.setBounds(mph.getSearchBounds()));
          // places = this.searchBox.getPlaces();
          queryPlaces.bounds = bnds;
          queryPlaces.location = mphmap.getCenter();
          queryPlaces.query = this.input.value;
          let service = new google.maps.places.PlacesService(mphmap);
          // if (queryPlaces.query !== '') {
              service.textSearch(queryPlaces, (p) => {
                  if (p.length != 0) {
                    mph.placeMarkers(p);
                  }
              })
          //}
          console.log(places);
          if (places.length == 0) {
            return;
          }
          // else {
          //     // this.placeMarkers(mphmap, places);
          //     mph.placeMarkers(places);
          // }
        // })
      });

    }

 placeMarkers(map, places) {

    var markers = [];

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
    };
}
