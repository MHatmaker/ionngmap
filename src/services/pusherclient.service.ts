import {
    Injectable
} from '@angular/core';
import {  PusherConfig } from '../pages/mlcomponents/libs/PusherConfig';
import { MapInstanceService } from '../services/MapInstanceService';
import { MLConfig } from '../pages/mlcomponents/libs/MLConfig';
// import { Pusher } from 'pusher-client';
import { Pusher } from 'pusher-js';
import { IEventDct } from '../pages/mlcomponents/libs/PusherEventHandler';

declare const Pusher: any;

export class PusherClient {
    private eventHandlers : Map<string, IEventDct> = new Map<string, IEventDct>();
    constructor(evtDct : IEventDct, clientName : string) {
        this.eventHandlers[clientName] = evtDct;
    }
}

@Injectable()
export class PusherClientService {
    // private ndx : number;
    // private evtDct : {};
    // private data : IPusherConfigParams;
    private userName : string = '';
    private channel : any = null;
    private CHANNELNAME : string = '';
    // private mph : null;
    private pusher : Pusher;
    private callbackFunction : null;
    private info : null;
    // private isInitialized : false;
    // private pusherClient : null;
    // private isInstantiated : false;
    // private serverUrl : string = 'https://maplinkr-simpleserver.herokuapp.com/';
    private clients : Map<string, PusherClient> = new Map<string, PusherClient>();
    private eventHandlers : Map<string, IEventDct>;
    private mapNumber : number;
    private clientName : string;
    private mlconfig : MLConfig;

    private statedata = {
        privateChannelMashover : null, // PusherConfig.masherChannel(),
        prevChannel : 'mashchannel',
        userName : this.userName,
        prevUserName : this.userName,
        whichDismiss : "Cancel",
        clientName : ''
    };

    constructor (
        private pusherConfig: PusherConfig,
        private mapInstanceService: MapInstanceService
      ){
    }

    setMLConfig(mlcfg : MLConfig) {
        this.mlconfig = mlcfg;
    }

    preserveState () {
        console.log("preserveState");
        // $scope.data.whichDismiss = 'Cancel';
        this.statedata.prevChannel = this.statedata.privateChannelMashover;
        console.log("preserve " + this.statedata.prevChannel + " from " + this.statedata.privateChannelMashover);
        this.statedata.userName = this.statedata.userName;
        console.log("preserve " + this.statedata.prevUserName + " from " + this.statedata.userName);
    }

    restoreState () {
        console.log("restoreState");
        // this.statedata.whichDismiss = 'Accept';
        console.log("restore " + this.statedata.privateChannelMashover + " from " + this.statedata.prevChannel);
        this.statedata.privateChannelMashover = this.statedata.prevChannel;
        console.log("restore " + this.statedata.userName + " from " + this.statedata.prevChannel);
        this.statedata.userName = this.statedata.prevUserName;
    }

    onAcceptChannel () {
        console.log("onAcceptChannel " + this.statedata.privateChannelMashover);
        this.userName = this.statedata.userName;
        this.CHANNELNAME = this.statedata.privateChannelMashover;
        this.statedata.clientName = this.clientName = 'map' + this.mapInstanceService.getSlideCount();
        this.pusherConfig.setChannel(this.statedata.privateChannelMashover);
        this.pusherConfig.setNameChannelAccepted(true);
        this.pusherConfig.setUserName(this.userName);
        // this.clients[this.clientName] = new PusherClient(null, this.clientName);
    }

    cancel () {
        this.restoreState();
    }


    PusherChannel(chnl) {
        var // pusher,
            // APP_ID = '40938',
            APP_KEY = this.pusherConfig.getAppKey(), //'5c6bad75dc0dd1cec1a6',
            APP_SECRET = this.pusherConfig.getSecretKey(), //'54546672d0196be97f6a',
            channel = chnl,
            channelBind,
            chlength = channel.length,
            channelsub = channel.substring(1);
        console.log("PusherChannel ready to create channel");
        // this.eventDct = eventDct;

        if (channel[0] === '/') {
            chlength = channel.length;
            channelsub = channel.substring(1);
            channelsub = channelsub.substring(0, chlength - 2);
            channel = channelsub;
        }

        this.CHANNELNAME = channel.indexOf("private-channel-") > -1 ? channel : 'private-channel-' + channel;
        console.log("with channel " + this.CHANNELNAME);

        console.log("PusherPath is " + this.pusherConfig.getPusherPath() + "/pusher/auth");
        this.pusher = new Pusher(APP_KEY, {
            authTransport: 'jsonp',
            authEndpoint: this.pusherConfig.getPusherPath() + "/pusher/auth", //'http://linkr622-arcadian.rhcloud.com/',
            clientAuth: {
                key: APP_KEY,
                secret: APP_SECRET,
                // user_id: USER_ID,
                // user_info: {}
            }
        });

        this.pusher.connection.bind('state_change', function (state) {
            if (state.current === 'connected') {
                // alert("Yipee! We've connected!");
                console.log("Yipee! We've connected!");
            } else {
                // alert("Oh-Noooo!, my Pusher connection failed");
                console.log("Oh-Noooo!, my Pusher connection failed");
            }
        });
        console.log("Pusher subscribe to channel " + this.CHANNELNAME);
        this.channel = channelBind = this.pusher.subscribe(this.CHANNELNAME);

        channelBind.bind('client-NewUrlEvent', function (frame) {
            console.log('frame is', frame);
            // eventDct['client-NewUrlEvent'](frame);
            console.log("back from NewUrlEvent");
        });

        channelBind.bind('client-NewMapPosition', function (frame) {
            console.log('frame is', frame);
            console.log("back from NewMapPosition Event");
        });

        console.log("BIND to client-MapXtntEvent");

        channelBind.bind('client-MapXtntEvent', function (frame) {
            console.log('frame is', frame);
            if (frame.hasOwnProperty('x')) {
                frame.lat = frame.y;
                frame.lon = frame.x;
                frame.zoom = frame.z;
            }
            var handlerkey : string,
                obj : IEventDct;
            for (handlerkey in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(handlerkey)) {
                    obj = this.eventHandlers[handlerkey];
                    obj['client-MapXtntEvent'](frame);
                }
            }
            console.log("back from boundsRetriever");
        });

        channelBind.bind('client-MapClickEvent', function (frame) {
            console.log('frame is', frame);
            if (frame.hasOwnProperty('x')) {
                frame.lat = frame.y;
                frame.lon = frame.x;
                frame.zoom = frame.z;
            }
            var handlerkey,
                obj;
            for (handlerkey in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(handlerkey)) {
                    obj = this.eventHandlers[handlerkey];
                    obj['client-MapClickEvent'](frame);
                }
            }
            console.log("back from clickRetriever");
        });

        channelBind.bind('pusher:subscription_error', function (statusCode) {
            //alert('Problem subscribing to "private-channel": ' + statusCode);
            console.log('Problem subscribing to "private-channel": ' + statusCode);
        });
        channelBind.bind('pusher:subscription_succeeded', function () {
            console.log('Successfully subscribed to "' + this.CHANNELNAME); // + 'r"');
        });
    }
    // this.PusherChannel(this.pusherConfig.getPusherChannel());

    // PusherClient(evtDct, clientName) {
    //     this.eventHandlers[clientName] = evtDct;
    // }
    createPusherClient(mlcfg, cbfn, nfo) : PusherClient {
        console.log("PusherSetupCtrl.createPusherClient");
        this.mlconfig = mlcfg;
        var
            mapHoster = this.mlconfig.getMapHosterInstance(),
            clientName = 'map' + this.mlconfig.getMapNumber();

        this.CHANNELNAME = this.pusherConfig.getPusherChannel();
        this.userName = this.pusherConfig.getUserName();
        this.mapNumber = this.mlconfig.getMapNumber();

        this.callbackFunction = cbfn;
        this.info = nfo;
        console.log("createPusherClient for map " + clientName);
        this.clients[clientName] = new PusherClient(mapHoster.getEventDictionary(), clientName);

        return this.clients[clientName];
    }

    setupPusherClient (resolve, reject) {
        var promise;
        this.userName = this.pusherConfig.getUserName();
/*
        promise = this.getPusherDetails();
        return promise.then(function (response) {
            console.log('getPusherDetails resolve response ' + response);
            resolve(response);
            return promise;
        }, function (error) {
            console.log('getPusherDetails error response ' + error);
            return error;
        });
        */
        // return promise;
        // this.displayPusherDialog();
    };

getPusherChannel() {
    var promise = new Promise(function (resolve, reject) {
        var result = this.setupPusherClient(resolve, reject);
        console.log('getPusherChannel returns ' + result);
    });
    return promise;
}

publishPanEvent(frame) {
    console.log('frame is', frame);
    var handler,
        obj;
    if (frame.hasOwnProperty('x')) {
        frame.lat = frame.y;
        frame.lon = frame.x;
        frame.zoom = frame.z;
    }
    for (handler in this.eventHandlers) {
        if (this.eventHandlers.hasOwnProperty(handler)) {
            obj = this.eventHandlers[handler];
            console.log("publish pan event to map " + this.eventHandlers[handler]);
            if (obj) {
                obj['client-MapXtntEvent'](frame);
            }
        }
    }
    // this.channel.trigger('client-MapXtntEvent', frame);
    // this.pusher.channels(this.CHANNELNAME).trigger('client-MapXtntEvent', frame);
}
publishClickEvent(frame) {
    console.log('frame is', frame);
    var handler,
        obj;
    if (frame.hasOwnProperty('x')) {
        frame.lat = frame.y;
        frame.lon = frame.x;
        frame.zoom = frame.z;
    }
    for (handler in this.eventHandlers) {
        if (this.eventHandlers.hasOwnProperty(handler)) {
            obj = this.eventHandlers[handler];
            console.log("publish click event to map " + this.eventHandlers[handler]);
            obj['client-MapClickEvent'](frame);
        }
    }
    this.channel.trigger('client-MapClickEvent', frame);
    // this.pusher.channels(this.CHANNELNAME).trigger('client-MapClickEvent', frame);
}

publishPosition(pos) {
    var handler,
        obj;
    for (handler in this.eventHandlers) {
        if (this.eventHandlers.hasOwnProperty(handler)) {
            obj = this.eventHandlers[handler];
            console.log("publish position event to map " + this.eventHandlers[handler]);
            obj['client-NewMapPosition'](pos);
        }
    }
    // this.pusher.channel(this.channel).trigger('client-NewMapPosition', pos);
}
}
