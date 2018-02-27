import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
// import { utils } from './utils';
import { MapHosterGoogle } from './MapHosterGoogle';
// import { GoogleMap } from '@agm/core/services/google-maps-types';
import { Startup } from './Startup';

@Injectable()
export class StartupGoogle extends Startup {
    // private hostName : string = "MapHosterGoogle";

    private gMap : google.maps.Map = null;
    private newSelectedWebMapId : string = '';
    private pusherChannel : string = '';
    private pusher : any = null;

    constructor (private mapNumber : number, private mapHoster : MapHosterGoogle, private mlconfig : MLConfig) {
        super();
        this.mlconfig.setMapNumber(mapNumber);
        this.mlconfig.setUserId(this.pusherConfig.getUserName() + mapNumber);
    }


    getMap () {
        return this.gMap;
    }

    getMapNumber () {
        return this.mapNumber;
    }
    getMapHosterInstance  (ndx) {
        return this.mapHoster;
    }

    configure (newMapId, mapLocOpts) {
        var
            centerLatLng,
            initZoom,
            mapGoogleLocOpts = {};
            // qlat,
            // qlon,
            // bnds,
            // zoomStr;

        console.log("StartupGoogle configure with map no. " + this.mapNumber);
        this.newSelectedWebMapId = newMapId;

        // window.loading = dojo.byId("loadingImg");
        // utils.showLoading();
        centerLatLng = new google.maps.LatLng(mapLocOpts.center.lat, mapLocOpts.center.lng);
        initZoom = mapLocOpts.zoom;

        // if (mapLocOpts) {
        //     centerLatLng = mapLocOpts.center;
        //     initZoom = mapLocOpts.zoom;
        // }

        mapGoogleLocOpts = {
            center: centerLatLng, //new google.maps.LatLng(41.8, -87.7),
            // center: new google.maps.LatLng(51.50, -0.09),
            zoom: initZoom,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.gMap = new google.maps.Map(document.getElementById("map" + this.mapNumber), mapGoogleLocOpts);
        console.log('StartupGoogle ready to instantiate Map Hoster with map no. ' + this.mapNumber);
        this.mapHoster = new MapHosterGoogle(this.mapNumber, this.mlconfig, );
        this.mapHoster.configureMap(this.gMap, mapGoogleLocOpts, google, google.maps.places, this.mlconfig);
        this.mlconfig.setMapHosterInstance(this.mapHoster);

        this.mapInstanceService.setMapHosterInstance(this.mapNumber, this.mlconfig);
        this.currentmaptypeservice.setCurrentMapType('google');

        this.pusher = this.pusherClientService.createPusherClient(
            this.mlconfig,
            function (channel, userName) {
                this.pusherConfig.setUserName(userName);
            },
            null
        );
        if (!this.pusher) {
            console.log("failed to create Pusher in StartupGoogle");
        }

    };
}
