
// import {} from 'google';
import { Component, NgZone, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MapInstanceService } from '../../../services/MapInstanceService';
import { DestselectionComponent } from '../../../components/destselection/destselection';

declare var google;

@Component({
  selector: 'places-for-maplinkr',
  templateUrl: './places.component.html',
  styles: [ './places.component.css']
})
export class PlacesSearchComponent implements AfterViewInit {
    @ViewChild("searchBox")
    searchBoxRef: ElementRef;
    input: any;
    searchBox: any;

  constructor(private _ngZone: NgZone, private mapInstanceService : MapInstanceService, private modalCtrl : ModalController) {

  }

  ngAfterViewInit() {
      this.input = this.searchBoxRef.nativeElement;

      this.searchBox = new google.maps.places.SearchBox(this.input);
      console.log('listening on searchBox');
      this.searchBox.addListener("places_changed", () => {
          let queryPlaces = {
            'bounds' : google.maps.LatLngBounds,
            'location': google.maps.LatLng,
            'query': String
          };
        // this._ngZone.run(() => {
          console.log(this.searchBox);
          let mph = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
          let mphmap = mph.getMap();
          let bnds = mph.getSearchBounds();
          console.log("searchBox latest bounds");
          console.log(bnds);

          queryPlaces.bounds = bnds;
          queryPlaces.location = mphmap.getCenter();
          queryPlaces.query = this.input.value;
          let service = new google.maps.places.PlacesService(mphmap);
              service.textSearch(queryPlaces, (p) => {
                  if (p.length != 0) {

          let modal = this.modalCtrl.create(DestselectionComponent);
          modal.present();
                    mph.placeMarkers(p);
                  } else {
                      return;
                  }
              });
      });

    }
}
