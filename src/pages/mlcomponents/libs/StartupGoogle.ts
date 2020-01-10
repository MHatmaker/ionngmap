// import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
// import { utils } from './utils';
import { MapHosterGoogle } from './MapHosterGoogle';
// import { GoogleMap } from '@agm/core/services/google-maps-types';
import { Startup } from './Startup';
import { PusherConfig } from './PusherConfig';
import { MapInstanceService} from '../../../services/MapInstanceService';
import { CurrentMapTypeService } from '../../../services/currentmaptypeservice';
import { PusherClientService } from '../../../services/pusherclient.service';
import { MapLocOptions, MapLocCoords } from '../../../services/positionupdate.interface';
import { AppModule } from '../../../app/app.module';

// @Injectable()
export class StartupGoogle extends Startup {
    // private hostName : string = "MapHosterGoogle";

    private gMap : google.maps.Map = null;
    private newSelectedWebMapId : string = '';
    private pusherChannel : string = '';
    private pusher : any = null;
    private mapHoster : MapHosterGoogle;
    private mlconfig : MLConfig;
    private pusherConfig : PusherConfig;
    private mapInstanceService : MapInstanceService;
    private pusherClientService : PusherClientService;
    private currentMapTypeService : CurrentMapTypeService;

    constructor (private mapNumber : number, mlconfig : MLConfig) {
        super();
        this.mlconfig = mlconfig;
        this.mlconfig.setMapNumber(mapNumber);
        this.pusherConfig = AppModule.injector.get(PusherConfig);
        this.currentMapTypeService = AppModule.injector.get(CurrentMapTypeService);
        this.mapInstanceService = AppModule.injector.get(MapInstanceService);
        this.pusherClientService = AppModule.injector.get(PusherClientService);
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
        this.mapHoster = new MapHosterGoogle(this.mapNumber, this.mlconfig);
        this.mapHoster.configureMap(this.gMap, mapGoogleLocOpts, google, google.maps.places, this.mlconfig);
        google.maps.event.trigger(mapElement, 'resize');
        this.mlconfig.setMapHosterInstance(this.mapHoster);
        this.mlconfig.setRawMap(this.gMap);

        this.mapInstanceService.setMapHosterInstance(this.mapNumber, this.mapHoster);
        this.currentMapTypeService.setCurrentMapType('google');

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
        return this.gMap;
    };
}
