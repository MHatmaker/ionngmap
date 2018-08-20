import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mlBounds } from '../../pages/mlcomponents/libs/mlBounds.interface';
import { MapLocOptions, MapLocCoords } from '../../services/positionupdate.interface';
import { MapInstanceService } from '../../services/MapInstanceService';

declare var google;

@Injectable()
export class SearchplacesProvider {
    private searchString : string;

    constructor(public mapInstanceService : MapInstanceService) {
        console.log('Hello SearchplacesProvider Provider');
    }

    getParameterByName(name: string) {
        // console.log("get paramater " + name + " from " + this.details.search);
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(this.searchString);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    getBoundsFromUrl (searchString : string) {
        this.searchString = searchString;
        let llx = this.getParameterByName('llx'),
            lly = this.getParameterByName('lly'),
            urx = this.getParameterByName('urx'),
            ury = this.getParameterByName('ury');
        return {'llx' : llx, 'lly' : lly, 'urx' : urx, 'ury' : ury};
    }

    searchForPlaces(queryArgs : any) {
        let gmap = this.mapInstanceService.getHiddenMap();
        let googlecntr = new google.maps.LatLng(queryArgs.lat, queryArgs.lng);

        let sw = new google.maps.LatLng(queryArgs.bnds.lly, queryArgs.bnds.llx);
        let ne = new google.maps.LatLng(queryArgs.bnds.ury,queryArgs.bnds.urx);
        let queryPlaces = {
          'bounds' : new google.maps.LatLngBounds(sw, ne),
          'location': googlecntr,
          'query': queryArgs.gmquery
        };
        let service = new google.maps.places.PlacesService(gmap);
        service.textSearch(queryPlaces, (p) => {
            if (p.length != 0) {
                return p;
            } else {
                console.log("no places returned from PlacesServices for ${query}")
                return null;
            }

        });
    }
}
