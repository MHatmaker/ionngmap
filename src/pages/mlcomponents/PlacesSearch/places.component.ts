
// import {} from 'google';
import { Component, NgZone, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MapInstanceService } from '../../../services/MapInstanceService';
import { DestselectionComponent } from '../../../components/destselection/destselection';
import { MapopenerProvider } from '../../../providers/mapopener/mapopener';
// import { MaplocoptsProvider } from '../../../providers/maplocopts/maplocopts';
import { MLConfig } from '../../../pages/mlcomponents/libs/MLConfig';
import { mlBounds } from '../../../pages/mlcomponents/libs/mlBounds.interface';
import { MapLocOptions, MapLocCoords, IMapShare } from '../../../services/positionupdate.interface';
import { EMapSource } from '../../../services/configparams.service';

declare var google;

@Component({
  selector: 'places-for-maplinkr',
  templateUrl: './places.component.html'
  // styles: [ './places.component.css']
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
                              let gmquery = this.input.value;
                              let coords : any = queryPlaces.location;
                              let cntr : MapLocCoords = { 'lng' : coords.lng(), 'lat' : coords.lat()};
                              let opts: MapLocOptions = { center :  cntr, zoom : gmap.getZoom(), places : p, query : gmquery};
                              let shr: IMapShare = {mapLocOpts : opts, userName : 'foo', mlBounds : bnds,
                                  source : EMapSource.placesgoogle, webmapId : 'nowebmap'};
                              this.mapopener.openMap.emit(shr);
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
