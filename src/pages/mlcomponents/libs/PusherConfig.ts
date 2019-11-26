import {
    Injectable,
} from '@angular/core';
import { utils } from './utils';

export interface IPusherConfigParams
{
      privateChannelMashover : string,
      prevChannel : string,
      userName : string,
      prevUserName : string,
      whichDismiss : string
};

export interface IPusherConfig {
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
        search : string,
        query : string
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
        pusherPathPre : "https://",
        // pusherPathNgrok :"maplinkroc3-maplinkr.7e14.starter-us-west-2.openshiftapps.com", //"c1232bf1",
        pusherPathNgrok :"smppushmaplinkrsrv.herokuapp.com",
        pusherPathPost : "", //".ngrok.io",
        search : '/',
        query : ""
    };
    private APP_ID : string;
    private APP_KEY : string;
    private APP_SECRET : string;
    constructor(private utils : utils) {
        console.log("entering PusherConfig");
    }

    getChannelFromUrl () : string {
        this.details.masherChannel = this.utils.getParameterByName('channel', this.details.search);
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
        return newWindow ? this.utils.getParameterByName('channel', this.details.search) : this.details.masherChannel;
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
    getBoundsFromUrl () {
        var llx = this.utils.getParameterByName('llx', this.details.search),
            lly = this.utils.getParameterByName('lly', this.details.search),
            urx = this.utils.getParameterByName('urx', this.details.search),
            ury = this.utils.getParameterByName('ury', this.details.search);
        return {'llx' : llx, 'lly' : lly, 'urx' : urx, 'ury' : ury};
    }
    getPusherPath () : string {
        var path = this.details.pusherPathPre + this.details.pusherPathNgrok + this.details.pusherPathPost;
        console.log("Pusher ngrok path is " + path);
        return path;
    }
    getQueryFromUrl() {
        let query = this.utils.getParameterByName('gmquery', this.details.search);
        return query;
    }
    getQuery() : string {
        return this.details.query;
    }
    setSearch (searchDetails: string) {
        this.details.search = searchDetails;
        this.details.query = this.getQueryFromUrl();
    }
    setPusherKeys(keys) {

      this.APP_ID = keys.appid;
      this.APP_KEY = keys.appkey;
      this.APP_SECRET = keys.appsecret;
    };

    getAppKey () : string {
        return this.APP_KEY;
    }
    getSecretKey () : string {
        return this.APP_SECRET;
    }
}
