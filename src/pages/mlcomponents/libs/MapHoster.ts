import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
import { PusherConfig } from './PusherConfig';
import { PusherClientService } from '../../../services/pusherclient.service';
import { utils } from './utils';


@Injectable()
export class MapHoster {

    constructor(protected utils: utils,
        protected pusherConfig : PusherConfig, protected geoCoder : GeoCodingService,
        protected pusherClientService : PusherClientService, protected positionUpdateService : PositionUpdateService) {
    }
}
