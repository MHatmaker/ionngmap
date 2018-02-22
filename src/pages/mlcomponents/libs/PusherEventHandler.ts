import {Injectable} from '@angular/core';

export interface IEventDct {
    'client-MapXtntEvent' : any,
    'client-MapClickEvent' : any,
    'client-NewMapPosition' : any
}

@Injectable()
export class PusherEventHandler {
    eventDct : IEventDct = {
        'client-MapXtntEvent' : null,
        'client-MapClickEvent' : null,
        'client-NewMapPosition' : null
    };

    constructor (private mapNumber : number) {
    }

    getEventDct  () : IEventDct {
        return this.eventDct;
    }

    addEvent  (evt : string, handler : any) {
        this.eventDct[evt] = handler;
    }

    getMapNumber  () : number {
        return this.mapNumber;
    }

    getHandler  (evt : string) : any{
        return this.eventDct[evt];
    }
}
