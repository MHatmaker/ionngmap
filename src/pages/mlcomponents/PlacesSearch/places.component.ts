
// import {} from 'google';
import { Component, NgZone, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MapInstanceService } from '../../../services/MapInstanceService';
import { DestselectionComponent } from '../../../components/destselection/destselection';
import { MapopenerProvider } from '../../../providers/mapopener/mapopener';
// import { MaplocoptsProvider } from '../../../providers/maplocopts/maplocopts';
import { MLConfig } from '../../../pages/mlcomponents/libs/MLConfig';
import { MapLocOptions, MapLocCoords } from '../../../services/positionupdate.interface'

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

  constructor(private _ngZone: NgZone, private mapInstanceService : MapInstanceService,
      private mapopener : MapopenerProvider, private modalCtrl : ModalController) {

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
          let gmap = this.mapInstanceService.getHiddenMap();
          let bnds = gmap.getBounds();
          let cntr = mph.getCenter();
          let googlecntr = new google.maps.LatLng(cntr.lat, cntr.lon);
          console.log("searchBox latest bounds");
          console.log(bnds);

          queryPlaces.bounds = bnds;
          queryPlaces.location = googlecntr;
          queryPlaces.query = this.input.value;
          let service = new google.maps.places.PlacesService(gmap);
              service.textSearch(queryPlaces, (p) => {
                  if (p.length != 0) {

                      let modal = this.modalCtrl.create(DestselectionComponent);
                      modal.onDidDismiss(data => {
                          console.log(data.destination.title);
                          if (data.destination.title == 'New Tab' || data.destination.title == "New Window") {
                              let coords : any = queryPlaces.location;
                              let cntr : MapLocCoords = { 'lng' : coords.lng(), 'lat' : coords.lat()};
                              let opts: MapLocOptions = { center :  cntr, zoom : gmap.getZoom(), places : p};
                              this.mapopener.openMap.emit(opts);
                          } else {
                              mph.placeMarkers(p);
                          }
                      })
                      modal.present();

                  } else {
                      return;
                  }
              });
      });

    }
}
