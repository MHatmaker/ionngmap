import { Injectable} from '@angular/core';
// import { MLConfig } from './MLConfig';
import { PusherConfig } from './PusherConfig';
import { PusherClientService } from '../../../services/pusherclient.service';
import { utils } from './utils';
import { PositionUpdateService } from '../../../services/positionupdate.service';
import { GeoCodingService } from '../../../services/GeoCodingService';
import { PusherEventHandler } from './PusherEventHandler';


@Injectable()
export class MapHoster {
    protected utils : utils;
    protected pusherConfig : PusherConfig;
    protected geoCoder : GeoCodingService;
    protected pusherClientService : PusherClientService;
    protected positionUpdateService : PositionUpdateService;
    protected pusherEventHandler : PusherEventHandler;
    constructor(
        ) {
    }
}