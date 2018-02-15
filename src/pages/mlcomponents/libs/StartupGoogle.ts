/*global require, define, google, console, document, loading, window, dojo*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('StartupGoogle setup');

    define([
        'libs/MapHosterGoogle',
        'controllers/PusherSetupCtrl',
        'libs/MLConfig',
        'libs/PusherConfig',
        'libs/utils'
    ], function (MapHosterGoogle, PusherSetupCtrl, MLConfig, PusherConfig, utils) {
        console.log('StartupGoogle define');
        var
            StartupGoogle  (mapNo, mapconfig) {
                console.log("StartupGoogle ctor");
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.gMap = null;
                this.newSelectedWebMapId = '';
                this.pusherChannel = null;
                this.pusher = null;
                this.mlconfig = mapconfig;
                this.mlconfig.setMapNumber(mapNo);
                this.mlconfig.setUserId(PusherConfig.getUserName() + mapNo);

                console.log("Setting mapNumber to " + this.mapNumber);
                var self = this,

                    getMap  () {
                        return self.gMap;
                    },

                    getMapNumber  () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance  (ndx) {
                        return self.mapHoster;
                    },

                    configure  (newMapId, mapLocOpts) {
                        var $inj,
                            mapInstanceSvc,
                            CurrentMapTypeService,
                            centerLatLng,
                            initZoom,
                            mapGoogleLocOpts = {};
                            // qlat,
                            // qlon,
                            // bnds,
                            // zoomStr;

                        console.log("StartupGoogle configure with map no. " + self.mapNumber);
                        self.newSelectedWebMapId = newMapId;

                        window.loading = dojo.byId("loadingImg");
                        utils.showLoading();
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
                        self.mapHoster = new MapHosterGoogle.MapHosterGoogle();
                        self.mapHoster.config(self.gMap, mapGoogleLocOpts, google, google.maps.places, self.mlconfig);
                        self.mlconfig.setMapHosterInstance(self.mapHoster);

                        $inj = self.mlconfig.getInjector();
                        mapInstanceSvc = $inj.get('MapInstanceService');
                        mapInstanceSvc.setMapHosterInstance(self.mapNumber, self.mapHoster);
                        CurrentMapTypeService = $inj.get('CurrentMapTypeService');
                        CurrentMapTypeService.setCurrentMapType('google');

                        self.pusher = PusherSetupCtrl.createPusherClient(
                            self.mlconfig,
                            function (channel, userName) {
                                PusherConfig.setUserName(userName);
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

        return {
            StartupGoogle: StartupGoogle
        };
    });
}());
