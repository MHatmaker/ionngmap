import {Injectable} from '@angular/core';

@Injectable()
export class PusherEventHandler {
    eventDct : {
        'client-MapXtntEvent' : null,
        'client-MapClickEvent' : null,
        'client-NewMapPosition' : null
    };

    constructor (private mapNumber) {
    }

    getEventDct  () {
        return this.eventDct;
    }

    addEvent  (evt, handler) {
        this.eventDct[evt] = handler;
    }

    getMapNumber  () {
        return this.mapNumber;
    }

    getHandler  (evt) {
        return this.eventDct[evt];
    }
}
