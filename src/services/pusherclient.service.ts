import {
    Injectable
} from '@angular/core';
import {  PusherConfig } from '../pages/mlcomponents/libs/PusherConfig';
import { MapInstanceService } from '../services/MapInstanceService';
import { MLConfig } from '../pages/mlcomponents/libs/MLConfig';
// import { Pusher } from 'pusher-client';
import { Pusher } from 'pusher-js';
import { IEventDct } from '../pages/mlcomponents/libs/PusherEventHandler';
import { MapopenerProvider } from '../providers/mapopener/mapopener';
import { IMapShare } from '../services/positionupdate.interface';
declare const Pusher: any;
import * as _ from 'underscore';

class PusherClient {
    public eventHandlers : IEventDct; // = new Map<string, IEventDct>();
    public clientName: string;
    public userName: string;
    public mapNumber : number;
    constructor(evtDct : IEventDct, clientName : string, userName : string, mapNumber : number) {
        this.eventHandlers = evtDct;
        this.clientName = clientName;
        this.userName = userName;
        this.mapNumber = mapNumber;
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
    // private serverUrl : string = 'https://smppushmaplinkrsrv.herokuapp.com/';
    private clients : Map<string, PusherClient> = new Map<string, PusherClient>();
    private eventHandlers : Map<string, IEventDct>;
    private mapNumber : number;
    private clientName : string;

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
        private mapInstanceService: MapInstanceService,
        private mapOpener : MapopenerProvider
      ){
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
        this.statedata.clientName = this.clientName = 'map' + this.mapInstanceService.getNextSlideNumber();
        this.pusherConfig.setChannel(this.statedata.privateChannelMashover);
        this.pusherConfig.setNameChannelAccepted(true);
        this.pusherConfig.setUserName(this.userName);
        // this.clients[this.clientName] = new PusherClient(null, this.clientName);
    }

    cancel () {
        this.restoreState();
    }

    traverseClients(evt, frame) {
        var clientName : string;
        var client : any;
        for(clientName in this.clients){
          if (this.clients[clientName]) {
                client = this.clients[clientName]
                if (client.eventHandlers.hasOwnProperty(evt)) {
                    client.eventHandlers[evt](frame);
                }
            }
        }
    }

    PusherChannel(chnl) {
        var // pusher,
            // APP_ID = '40938',
            APP_KEY = this.pusherConfig.getAppKey(),
            APP_SECRET = this.pusherConfig.getSecretKey(),
            channel = chnl,
            channelBind,
            chlength = channel.length,
            channelsub = channel.substring(1);
        console.log("PusherChannel ready to create channel");
        console.log(`AppKey : ${APP_KEY}, APP_SECRET ${APP_SECRET}`);
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
            console.log("currently unsupported NewUrlEvent");
        });

        channelBind.bind('client-NewMapPosition', (frame : IMapShare) => {
            console.log('frame is', frame);
            console.log("Open slide on NewMapPosition Event");
            this.mapOpener.openMap.emit(frame);
            // this.testShare.testShare.emit(frame);
        });

        console.log("BIND to client-MapXtntEvent");

        channelBind.bind('client-MapXtntEvent',  (frame) => {
            console.log('frame is', frame);
            // frame might already have lat, lon, zoom, rather than x, y, z properties
            if (frame.hasOwnProperty('x')) {
                frame.lat = frame.y;
                frame.lon = frame.x;
                frame.zoom = frame.z;
            }
            this.traverseClients('client-MapXtntEvent', frame);

            console.log("back from boundsRetriever");
        });

        channelBind.bind('client-MapClickEvent', (frame) => {
            console.log('frame is', frame);
            // frame might already have lat, lon, zoom, rather than x, y, z properties
            if (frame.hasOwnProperty('x')) {
                frame.lat = frame.y;
                frame.lon = frame.x;
                frame.zoom = frame.z;
            }
            this.traverseClients('client-MapClickEvent', frame);
            // for (handlerkey in this.eventHandlers) {
            //     if (this.eventHandlers.hasOwnProperty(handlerkey)) {
            //         obj = this.eventHandlers[handlerkey];
            //         obj['client-MapClickEvent'](frame);
            //     }
            // }
            console.log("back from clickRetriever");
        });

        channelBind.bind('pusher:subscription_error', function (statusCode) {
            //alert('Problem subscribing to "private-channel": ' + statusCode);
            console.log('Problem subscribing to "private-channel": ' + statusCode);
        });
        channelBind.bind('pusher:subscription_succeeded', function () {
            console.log('Successfully subscribed to "' + this.CHANNELNAME); // + 'r"');
        });
    // this.PusherChannel(this.pusherConfig.getPusherChannel());

    // PusherClient(evtDct, clientName) {
    //     this.eventHandlers[clientName] = evtDct;
    // }
    }
    createPusherClient(mlcfg, cbfn, nfo) : PusherClient {
        console.log("pusherClientService.createPusherClient");
        var
            mapHoster = mlcfg.getMapHosterInstance(),
            clientName = 'map' + this.pusherConfig.getUserName() + mlcfg.getMapNumber();

        this.CHANNELNAME = this.pusherConfig.getPusherChannel();
        this.userName = this.pusherConfig.getUserName();
        this.mapNumber = mlcfg.getMapNumber();

        this.callbackFunction = cbfn;
        this.info = nfo;
        console.log("createPusherClient for map " + clientName);
        this.clients[clientName] = new PusherClient(mapHoster.getEventDictionary(), clientName, this.userName, this.mapNumber);
        this.PusherChannel(this.CHANNELNAME);

        return this.clients[clientName];
    }

    createHiddenPusherClient(evtDct : IEventDct) {
        this.CHANNELNAME = this.pusherConfig.getPusherChannel();
        this.clients['hiddenmap'] = new PusherClient(evtDct, 'hiddenmap', 'hiddenmap', 99);
        this.PusherChannel(this.CHANNELNAME);
    }

    setupPusherClient (resolve, reject) {
        // var promise;
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
    var handler, client : PusherClient,
        clName,
        obj;
    if (frame.hasOwnProperty('x')) {
        frame.lat = frame.y;
        frame.lon = frame.x;
        frame.zoom = frame.z;
    }
    for (clName in this.clients) {
        client = this.clients[clName];
    // for (handler in this.clients.  eventHandlers) {
        if (client.hasOwnProperty('eventHandlers')) {
            obj = client.eventHandlers;
            console.log("publish pan event to map " + client.eventHandlers);
            if (obj) {
                obj['client-MapXtntEvent'](frame);
            }
        }
        // if (this.eventHandlers.hasOwnProperty(handler)) {
        //     obj = this.eventHandlers[handler];
        //     console.log("publish pan event to map " + this.eventHandlers[handler]);
        //     if (obj) {
        //         obj['client-MapXtntEvent'](frame);
        //     }
        // }
    }
    this.channel.trigger('client-MapXtntEvent', frame);
    // this.pusher.channels[this.CHANNELNAME].trigger('client-MapXtntEvent', frame);
}
publishClickEvent(frame) {
    console.log(`publishClickEvent : frame for frame.mapId - ${frame.mapId} , referrerId - ${frame.referrerId}
        popId - ${frame.popId}`);
    console.log(frame);
    if (frame.hasOwnProperty('x')) {
        frame.lat = frame.y;
        frame.lon = frame.x;
        frame.zoom = frame.z;
    }
    let withoutHidden = _.without(this.clients, this.clients['hiddenmap']);
    console.log(withoutHidden);
    let withoutSubmitter = _.without(withoutHidden, this.clients[frame.mapId]);
    console.log(withoutSubmitter);
    let withoutPopId = _.without(withoutSubmitter, this.clients[frame.popId]);
    console.log(withoutPopId);
    _.each(withoutPopId, (client) => {
        let testId = client.userName + client.mapNumber;
        console.log(`client is clientName ${client.clientName}, userName ${client.userName}, testId ${testId}`);
        if(testId !== frame.referrerId) {
          if (client.hasOwnProperty('eventHandlers')) {
              let obj = client.eventHandlers;
              console.log("publish shared click event to map " + client.clientName);
              obj['client-MapClickEvent'](frame);
          }
        }
    });

    // for (clName in this.clients) {
    //     if(!((clName === frame.mapId) || (clName === 'hiddenmap'))){
    //       client = this.clients[clName];
    //       console.log(`client is clientName ${client.clientName} userName ${client.userName}`);
    //       if(client.userName !== frame.referrerId){
    //           if (client.hasOwnProperty('eventHandlers')) {
    //               obj = client.eventHandlers;
    //               console.log("publish shared click event to map " + client.clientName);
    //               obj['client-MapClickEvent'](frame);
    //           }
    //         }
    //   }
    // }
    this.channel.trigger('client-MapClickEvent', frame);
    // this.pusher.channels(this.CHANNELNAME).trigger('client-MapClickEvent', frame);
}

publishPosition(pos : string) {
    // var handler, client : PusherClient,
    //     clName,
    //     obj;
    // for (clName in this.clients) {
    //     client = this.clients[clName];
    //     if (client.hasOwnProperty('eventHandlers')) {
    //         obj = client.eventHandlers;
    //         console.log("publish position event to map " + client.eventHandlers);
    //         obj['client-NewMapPosition'](pos);
    //     }
    // }
    this.channel.trigger('client-NewMapPosition', pos);
  }
}
