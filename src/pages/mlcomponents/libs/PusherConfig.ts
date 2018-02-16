import {
    Injectable,
} from '@angular/core';

console.log("loading PusherConfig");

interface IPusherConfig {
    details : {
        masherChannel : string,
        masherChannelInitialized : boolean,
        nameChannelAccepted : boolean,
        userName : string,
        userId : string,
        pusherPathPre : string,
        // pusherPathNgrok :"maplinkroc3-maplinkr.7e14.starter-us-west-2.openshiftapps.com", //"c1232bf1",
        pusherPathNgrok :string,
        pusherPathPost : string,
        search : string
    }
}

@Injectable()
export class PusherConfig implements IPusherConfig {
    details = {
        masherChannel : "private-channel-mashchannel",
        masherChannelInitialized : false,
        nameChannelAccepted : false,
        userName : 'defaultuser',
        userId : 'uidnone',
        pusherPathPre : "http://",
        // pusherPathNgrok :"maplinkroc3-maplinkr.7e14.starter-us-west-2.openshiftapps.com", //"c1232bf1",
        pusherPathNgrok :"maplinkr-simpleserver.herokuapp.com",
        pusherPathPost : "", //".ngrok.io",
        search : '/'
    };
    constructor() {
        console.log("entering PusherConfig");

    }
    getParameterByName(name: string) {
        // console.log("get paramater " + name + " from " + this.details.search);
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(this.details.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    getChannelFromUrl () : string {
        this.details.masherChannel = this.getParameterByName('channel');
        this.details.masherChannelInitialized = true;
        return this.details.masherChannel;
    }
    isChannelInitialized () : boolean{
        return this.details.masherChannelInitialized;
    }

    setNameChannelAccepted (tf: boolean) {
        if (this.details.nameChannelAccepted === false) {
            this.details.nameChannelAccepted = true;
        }
        this.details.nameChannelAccepted = tf;
    }
    isNameChannelAccepted () : boolean{
        return this.details.nameChannelAccepted;
    }
    setChannel (chnl: string) {
        if (this.details.masherChannelInitialized === false) {
            this.details.masherChannelInitialized = true;
        }
        this.details.masherChannel = chnl;
    }
    masherChannel (newWindow: boolean) : string {
        // alert(getParameterByName('channel'));
        // alert(this.details.masherChannel);
        return newWindow ? this.getParameterByName('channel') : this.details.masherChannel;
    }
    getPusherChannel () : string {
        return this.details.masherChannel;
    }
    getUserName () : string {
        return this.details.userName;
    }
    setUserName (name: string) {
        this.details.userName = name;
    }
    setUserId (uid: string) {
        this.details.userId = uid;
    }
    getUserId () : string {
        return this.details.userId;
    }
    getPusherPath () : string {
        var path = this.details.pusherPathPre + this.details.pusherPathNgrok + this.details.pusherPathPost;
        console.log("Pusher ngrok path is " + path);
        return path;
    }
    setSearch (searchDetails: string) {
        this.details.search = searchDetails;
    }
}