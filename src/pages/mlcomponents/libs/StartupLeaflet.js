/*global require, define, L, dojo, google, console, window, document, lmap*/
/*jslint unparam: true*/

(function () {
    "use strict";
    // require(['lib/MapHosterLeaflet']);

    console.log('StartupLeaflet setup');
    define([
        'libs/MapHosterLeaflet',
        'controllers/PusherSetupCtrl',
        'libs/MLConfig',
        'libs/PusherConfig'
    ], function (MapHosterLeaflet, PusherSetupCtrl, MLConfig, PusherConfig) {
        console.log('StartupLeaflet define');
        var
            StartupLeaflet = function (mapNo, mlconfig) {
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.lMap = null;
                this.newSelectedWebMapId = '';
                this.pusherChannel = null;
                this.pusher = null;
                this.mlconfig = mlconfig;
                this.mlconfig.setMapNumber(mapNo);
                this.mlconfig.setUserId(PusherConfig.getUserName() + mapNo);

                console.log("Setting mapNumber to " + this.mapNumber);
                var
                    self = this,
                    getMap = function () {
                        return self.lMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance = function (ndx) {
                        return self.mapHoster;
                    },
                    // openAGOWindow = function (channel, userName) {
                    //     var url = "?id=" + self.newSelectedWebMapId + MapHosterLeaflet.getGlobalsForUrl() + "&channel=" + channel + "&userName=" + userName;
                    //     console.log("open new ArcGIS window with URI " + url);
                    //     console.log("using channel " + channel + " with user name " + userName);
                    //     self.mlconfig.setUrl(url);
                    //     self.mlconfig.setChannel(channel);
                    //     self.mlconfig.userName(userName);
                    //     window.open(self.mlconfig.gethref() + "arcgis/" + url, self.newSelectedWebMapId, self.mlconfig.getSmallFormDimensions());
                    // },

                    configure = function (newMapId, mapLocOpts) {
                        var $inj = self.mlconfig.getInjector(),
                            mapInstanceSvc = $inj.get('MapInstanceService'),
                            mapTypeSvc = $inj.get('CurrentMapTypeService');
                        self.newSelectedWebMapId = newMapId;
                        // mapInstanceSvc.setCurrentMapType('leaflet');
                        window.loading = dojo.byId("loadingImg");
                        console.log(window.loading);
                        console.log("newSelectedWebMapId " + newMapId);
                        // if (self.newSelectedWebMapId !== null) {
                        //     if (self.mlconfig.isChannelInitialized() === false) {
                        //         // PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                        //         //     PusherConfig.getUserName(), openNewDisplay,
                        //         //         {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
                        //
                        //         PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                        //             PusherConfig.getUserName(), function (channel, userName) {
                        //                 PusherConfig.setUserName(userName); /*,openNewDisplay, how did this get in here?
                        //                     {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId};*/
                        //                 openAGOWindow(channel, userName);
                        //             });
                        //     } else {
                        //         openAGOWindow(PusherConfig.masherChannel(false));
                        //     }
                        // } else {

                        if (self.lMap) {
                            // lMap.remove();
                            self.lMap = new L.Map(document.getElementById("map" + self.mapNumber));
                        } else {
                            self.lMap = new L.Map(document.getElementById("map" + self.mapNumber));
                        }

                        self.mapHoster = new MapHosterLeaflet.MapHosterLeaflet();
                        self.mapHoster.config(self.lMap, mapLocOpts, self.mlconfig);
                        mapInstanceSvc.setMapHosterInstance(self.mapNumber, self.mapHoster);
                        mapInstanceSvc.setConfigInstanceForMap(self.mapNumber, self.mlconfig);
                        mapTypeSvc.setCurrentMapType('leaflet');
                        self.mlconfig.setUserId(PusherConfig.getUserName() + self.mapNumber);
                        self.pusherChannel = PusherConfig.masherChannel(false);
                        console.debug(self.pusherChannel);
                        self.pusher = PusherSetupCtrl.createPusherClient(
                            self.mlconfig,
                            function (channel, userName) {
                                PusherConfig.setUserName(userName);
                            },
                            null
                            // {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId}
                        );
                        if (!self.pusher) {
                            console.log("createPusherClient failed in StartupLeaflet");
                        }
                        // }
                    };

                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    configure: configure
                };
            };
        return {
            StartupLeaflet: StartupLeaflet
        };
    });
}());
