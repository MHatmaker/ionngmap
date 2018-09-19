import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mlBounds } from '../../pages/mlcomponents/libs/mlBounds.interface';
import { MapLocOptions, MapLocCoords, IMapShare } from '../../services/positionupdate.interface';
import { MapInstanceService } from '../../services/MapInstanceService';

declare var google;

@Injectable()
export class SearchplacesProvider {
    private searchString : string;
    private configDetails : IMapShare;

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
    query() {
        return this.getParameterByName('gmquery');
    }
    lon  () : number {
        let s = this.getParameterByName('lon');
        return  Number(s);
    }
    lat  () : number {
        return Number(this.getParameterByName('lat'));
    }
    zoom  () : number {
        return Number(this.getParameterByName('zoom'));
    }

    async searchForPlaces(opts : IMapShare, cb : any) {
        // pos = {center : cntr, zoom : zoom, query : gmQuery, places : null};
        let gmap = this.mapInstanceService.getHiddenMap();

        let googlecntr = new google.maps.LatLng(opts.mapLocOpts.center.lat, opts.mapLocOpts.center.lng);
        let bnds = opts.mlBounds;
        let gmquery = opts.mapLocOpts.query;

        let sw = new google.maps.LatLng(bnds.lly, bnds.llx);
        let ne = new google.maps.LatLng(bnds.ury, bnds.urx);
        let queryPlaces = {
          'bounds' : new google.maps.LatLngBounds(sw, ne),
          'location': googlecntr,
          'query': gmquery
        };
        let service = new google.maps.places.PlacesService(gmap);
        await service.textSearch(queryPlaces, (p) => {
            if (p.length != 0) {
                return p;
            } else {
                console.log("no places returned from PlacesServices for ${query}")
                return null;
            }

        });
    }
}
