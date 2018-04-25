import { Injectable} from '@angular/core';
// import { MLConfig } from './MLConfig';
import { PusherConfig } from './PusherConfig';
import { PusherClientService } from '../../../services/pusherclient.service';
import { utils } from './utils';
import { PositionUpdateService } from '../../../services/positionupdate.service';
import { GeoCodingService, OSMAddress } from '../../../services/GeoCodingService';
import { PusherEventHandler } from './PusherEventHandler';
import { GeoPusherSupport } from './geopushersupport';


@Injectable()
export class MapHoster {
    // protected utils : utils;
    // protected pusherConfig : PusherConfig;
    // protected geoCoder : GeoCodingService;
    // protected pusherClientService : PusherClientService;
    // protected positionUpdateService : PositionUpdateService;
    // protected pusherEventHandler : PusherEventHandler;
    // constructor(protected utils?: utils, protected pusherConfig?: PusherConfig, protected geoCoder?: GeoCodingService,
    //     protected pusherClientService?: PusherClientService, protected positionUpdateService?: PositionUpdateService,
    //     protected pusherEventHandler?: PusherEventHandler
    //     ) {
    // }
    constructor(protected geopush : GeoPusherSupport) {}
    getMap() {
        return null;
    }
    getSearchBounds() {
        console.log("MapHoster base class getSearchBounds");
        return null;
    }
    placeMarkers(places) {
        console.log('MapHoster base class placeMarkers');
    }
}
