import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
import { PusherConfig } from './PusherConfig';
import { PusherClientService } from '../../../services/pusherclient.service';
import { utils } from './utils';
import { MapHosterGoogle } from './MapHosterGoogle';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { MapInstanceService } from '../../../services/MapInstanceService';
import { CurrentMapTypeService } from '../../../services/currentmaptypeservice';

@Injectable()
export class StartupGoogle {
    private hostName : string = "MapHosterGoogle";
    private mapNumber : number = -1;
    private mapHoster : MapHosterGoogle = null;
    private gMap : google.maps.Map = null;
    private newSelectedWebMapId : string = '';
    private pusherChannel : string = '';
    private pusher : any = null;

    constructor (private mapHosterGoogle : MapHosterGoogle, private pusherClientService : PusherClientService,
        private mlConfig : MLConfig, private pusherConfig : PusherConfig, private utils : utils,
        private mapInstanceService : MapInstanceService, private currentmaptypeservice : CurrentMapTypeService) {
    }

            startupGoogle  (mapNo, mapconfig) {
                console.log("StartupGoogle ctor");
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.gMap = null;
                this.newSelectedWebMapId = '';
                this.pusherChannel = null;
                this.pusher = null;
                this.mlConfig = mapconfig;
                this.mlConfig.setMapNumber(mapNo);
                this.mlConfig.setUserId(this.pusherConfig.getUserName() + mapNo);

                console.log("Setting mapNumber to " + this.mapNumber);
                var self = this,

                    getMap = function () {
                        return self.gMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance = function  (ndx) {
                        return self.mapHoster;
                    },

                    configure = function (newMapId, mapLocOpts) {
                        var
                            centerLatLng,
                            initZoom,
                            mapGoogleLocOpts = {};
                            // qlat,
                            // qlon,
                            // bnds,
                            // zoomStr;

                        console.log("StartupGoogle configure with map no. " + self.mapNumber);
                        self.newSelectedWebMapId = newMapId;

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

                        self.gMap = new google.maps.Map(document.getElementById("map" + self.mapNumber), mapGoogleLocOpts);
                        console.log('StartupGoogle ready to instantiate Map Hoster with map no. ' + self.mapNumber);
                        self.mapHoster = new MapHosterGoogle();
                        self.mapHoster.configureMap(self.gMap, mapGoogleLocOpts, google, google.maps.places, this.mlConfig);
                        this.mlConfig.setMapHosterInstance(self.mapHoster);

                        this.mapInstanceService.setMapHosterInstance(self.mapNumber, self.mapHoster);
                        this.currentMapTypeService.setCurrentMapType('google');

                        self.pusher = this.pusherClientService.createPusherClient(
                            this.mlConfig,
                            function (channel, userName) {
                                this.pusherConfig.setUserName(userName);
                            },
                            null
                        );
                        if (!self.pusher) {
                            console.log("failed to create Pusher in StartupGoogle");
                        }

                    };

                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    configure: configure
                };
            };

}
