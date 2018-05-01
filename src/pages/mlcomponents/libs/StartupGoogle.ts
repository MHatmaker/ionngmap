// import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
// import { utils } from './utils';
import { MapHosterGoogle } from './MapHosterGoogle';
// import { GoogleMap } from '@agm/core/services/google-maps-types';
import { Startup } from './Startup';
import { GeoPusherSupport, IGeoPusher } from './geopushersupport';
import { utils } from './utils';

export interface MapLocCoords {
    lat : number,
    lng : number
}

export interface MapLocOptions {
    center : MapLocCoords,
    zoom : number
}

// @Injectable()
export class StartupGoogle extends Startup {
    // private hostName : string = "MapHosterGoogle";

    private gMap : google.maps.Map = null;
    private newSelectedWebMapId : string = '';
    private pusherChannel : string = '';
    private pusher : any = null;
    private mapHoster : MapHosterGoogle;
    private mlconfig : MLConfig;
    private geopushSup : IGeoPusher;

    constructor (private mapNumber : number, mlconfig : MLConfig, private geopush : GeoPusherSupport) {
        super(geopush);
        this.mlconfig = mlconfig;
        this.mlconfig.setMapNumber(mapNumber);
        this.geopushSup = geopush.getGeoPusherSupport();
        this.mlconfig.setUserId(this.geopushSup.pusherConfig.getUserName() + mapNumber);
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

    configure (newMapId : string, mapElement : HTMLElement, mapLocOpts : MapLocOptions) : google.maps.Map {
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

        this.gMap = new google.maps.Map(mapElement, mapGoogleLocOpts);
        console.log('StartupGoogle ready to instantiate Map Hoster with map no. ' + this.mapNumber);
        this.mapHoster = new MapHosterGoogle(this.mapNumber, this.mlconfig, this.geopush);
        this.mapHoster.configureMap(this.gMap, mapGoogleLocOpts, google, google.maps.places, this.mlconfig);
        let divId = "google-map-component" + this.mapNumber;
        let hgt = this.geopush.getGeoPusherSupport().utils.getElementDimension(divId, 'width');
        this.geopush.getGeoPusherSupport().utils.setElementWidth(divId, hgt+1, 'px');
        this.geopush.getGeoPusherSupport().utils.setElementWidth(divId, hgt, 'px');
        google.maps.event.trigger(mapElement, 'resize');
        this.mlconfig.setMapHosterInstance(this.mapHoster);
        this.mlconfig.setRawMap(this.gMap);

        this.geopushSup.mapInstanceService.setMapHosterInstance(this.mapNumber, this.mapHoster);
        this.geopushSup.currentMapTypeService.setCurrentMapType('google');

        this.pusher = this.geopushSup.pusherClientService.createPusherClient(
            this.mlconfig,
            function (channel, userName) {
                this.pusherConfig.setUserName(userName);
            },
            null
        );
        if (!this.pusher) {
            console.log("failed to create Pusher in StartupGoogle");
        }
        return this.gMap;
    };
}
