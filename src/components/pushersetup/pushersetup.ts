import { Component } from '@angular/core';
import { IPusherConfig, IPusherConfigParams, PusherConfig } from '../../pages/mlcomponents/libs/PusherConfig';


@Component({
    selector: 'pushersetup',
    templateUrl: 'pushersetup.html'
})
export class PushersetupComponent {
    private data : IPusherConfigParams;
    private userName : string = '';
    private channel : string = '';
    private mph : null;
    private pusher : null;
    private callbackFunction : null;
    private info : null;
    private isInitialized : false;
    private PusherClient : null;
    private isInstantiated : false;
    private serverUrl : 'https://maplinkr-simpleserver.herokuapp.com/';
    private clients : {};
    private eventHandlers : {};
    private displayPusherDialog : null

    constructor(private pusherConfig : PusherConfig) {
      console.log('Hello PushersetupComponent Component');
    this.data.privateChannelMashover = this.pusherConfig.masherChannel(false),
    this.data.prevChannel = 'mashchannel',
    this.data.userName = this.userName,
    this.data.prevUserName = this.userName,
    this.data.whichDismiss = "Cancel"
    }

}
