import { Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
import { MapLocOptions } from '../../../services/positionupdate.interface';


@Injectable()
export class MapHoster {
    constructor() {}
    getMap() {
        return null;
    }
    getSearchBounds() {
        console.log("MapHoster base class getSearchBounds");
        return null;
    }
    getCenter() {
        console.log("MapHoster base class getCenter");
        return null;
    }
    placeMarkers(places) {
        console.log('MapHoster base class placeMarkers');
    }
    setSearchBox(b) {
        console.log('MapHoster base class setSearchBox');
    }
    getmlconfig() : MLConfig{
        console.log("MapHoster base class getmlconfig");
        return null;
    }
    setCurrentLocation(loc : MapLocOptions) {
      console.log("MapHoster base class for setCurrentLocation");
      return null;
    }
}
