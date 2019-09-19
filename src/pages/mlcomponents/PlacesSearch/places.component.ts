
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
import { CanvasService } from '../../../services/CanvasService';

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
      private canvasService : CanvasService, private mapopener : MapopenerProvider, private modalCtrl : ModalController) {

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
          // console.log(this.searchBox);
          console.log(this.input.value);

          if (this.mapInstanceService.getSlideCount() == 0) {
              let geocoder = new google.maps.Geocoder();
              geocoder.geocode({'address': this.input.value}, (results, status) => {
              if (status === 'OK') {
                let loc = {lng : results[0].geometry.location.lng(), lat : results[0].geometry.location.lat()}
                let opts: MapLocOptions = { center :  loc, zoom : 15, places : null, query : this.input.value};
                this.canvasService.setInitialLocation(opts);
                this.canvasService.addInitialCanvas("");
              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });

          } else {
            let mph = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
            let gmap = this.mapInstanceService.getHiddenMap();
            let bnds = gmap.getBounds();
            let cntr = mph.getCenter();
            let googlecntr = new google.maps.LatLng(cntr.lat, cntr.lon);
            console.log("searchBox latest bounds");
            console.log(bnds);

            queryPlaces.bounds = null; // bnds;
            queryPlaces.location = null; // googlecntr;
            queryPlaces.query = this.input.value;
            let service = new google.maps.places.PlacesService(gmap);
                try {
                service.textSearch(queryPlaces, (p, status, pagination) => {
                    console.log(status);
                    if (p.length != 0) {

                        let modal = this.modalCtrl.create(DestselectionComponent);
                        modal.onDidDismiss(data => {
                            console.log(data.destination.title);
                            if (data.destination.title == 'New Tab' || data.destination.title == "New Window") {
                                let opts : MapLocOptions = null;
                                let gmquery = this.input.value;
                                if (queryPlaces.location) {
                                      let coords : any = queryPlaces.location;
                                      let cntr : MapLocCoords = { 'lng' : coords.lng(), 'lat' : coords.lat()};
                                      opts = { center :  cntr, zoom : gmap.getZoom(), places : p, query : gmquery};
                                    } else {
                                      bnds = new google.maps.LatLngBounds();
                                      for (let i=0; i < p.length; i++) {
                                        bnds.extend(p[i].geometry.location);
                                      }
                                      let cntr2 : google.maps.LatLng = bnds.getCenter();
                                      let cntr3 : MapLocCoords = {lng: cntr2.lng(), lat: cntr2.lat()};
                                      opts = { center :  cntr3, zoom : gmap.getZoom(), places : p, query : gmquery};
                                  }
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
              }
              catch(error) {
                console.log(error);
              }
            }
      });

    }

}
