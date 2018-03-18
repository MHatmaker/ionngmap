
import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { ConfigParams } from '../../../services/configparams.service';
import * as L from "leaflet";
import { MapHosterLeaflet } from './MapHosterLeaflet'
import { GeoCoder } from './GeoCoder';
// import { utils } from './utils';
// import { PusherClientService }from '../../../services/pusherclient.service';
import { Startup } from './Startup';
import { GeoPusherSupport } from './geopushersupport';

// @Injectable()
export class StartupLeaflet extends Startup {
    private mapHoster = null;
    private newSelectedWebMapId = '';
    private lMap = null;
    private pusherChannel = null;
    private pusher = null;
    private mapNumber = null;
    private mlconfig : MLConfig;

    constructor(private mapNo: number, mlconfig: MLConfig, private geoCoderLflt : GeoCoder,
        private geopush : GeoPusherSupport) {
        super(geopush);
        this.mlconfig = mlconfig;
        this.mlconfig.setMapNumber(mapNo);
        this.mlconfig.setUserId(this.geopush.getGeoPusherSupport().pusherConfig.getUserName() + mapNo);
    }
    getMap  () {
        return this.lMap;
    }

    getMapNumber  () {
        return this.mapNumber;
    }
    getMapHosterInstance  (ndx) {
        return this.mapHoster;
    }
    // openAGOWindow  (channel, userName) {
    //     var url = "?id=" + this.newSelectedWebMapId + MapHosterLeaflet.getGlobalsForUrl() + "&channel=" + channel + "&userName=" + userName;
    //     console.log("open new ArcGIS window with URI " + url);
    //     console.log("using channel " + channel + " with user name " + userName);
    //     this.mlconfig.setUrl(url);
    //     this.mlconfig.setChannel(channel);
    //     this.mlconfig.userName(userName);
    //     window.open(this.mlconfig.gethref() + "arcgis/" + url, this.newSelectedWebMapId, this.mlconfig.getSmallFormDimensions());
    // },

    configure  (newMapId, mapLocOpts) {
        var $inj = this.mlconfig.getInjector(),
            mapInstanceSvc = $inj.get('MapInstanceService'),
            mapTypeSvc = $inj.get('CurrentMapTypeService');
        this.newSelectedWebMapId = newMapId;
        // mapInstanceSvc.setCurrentMapType('leaflet');
        // window.loading = dojo.byId("loadingImg");
        // console.log(window.loading);
        console.log("newSelectedWebMapId " + newMapId);
        // if (this.newSelectedWebMapId !== null) {
        //     if (this.mlconfig.isChannelInitialized() === false) {
        //         // PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
        //         //     PusherConfig.getUserName(), openNewDisplay,
        //         //         {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
        //
        //         PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
        //             PusherConfig.getUserName(), (channel, userName) {
        //                 PusherConfig.setUserName(userName); /*,openNewDisplay, how did this get in here?
        //                     {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId};*/
        //                 openAGOWindow(channel, userName);
        //             });
        //     } else {
        //         openAGOWindow(PusherConfig.masherChannel(false));
        //     }
        // } else {

        if (this.lMap) {
            // lMap.remove();
            this.lMap = new L.Map(document.getElementById("map" + this.mapNumber));
        } else {
            this.lMap = new L.Map(document.getElementById("map" + this.mapNumber));
        }

        this.mapHoster = new MapHosterLeaflet(this.mapNo, this.mlconfig, this.geopush, this.geoCoderLflt);
        this.mapHoster.config(this.lMap, mapLocOpts, this.mlconfig);
        mapInstanceSvc.setMapHosterInstance(this.mapNumber, this.mapHoster);
        mapInstanceSvc.setConfigInstanceForMap(this.mapNumber, this.mlconfig);
        mapTypeSvc.setCurrentMapType('leaflet');
        this.mlconfig.setUserId(this.geopush.getGeoPusherSupport().pusherConfig.getUserName() + this.mapNumber);
        this.pusherChannel = this.geopush.getGeoPusherSupport().pusherConfig.masherChannel(false);
        console.debug(this.pusherChannel);
        this.pusher = this.geopush.getGeoPusherSupport().pusherClientService.createPusherClient(
            this.mlconfig,
            (channel, userName) => {
                this.geopush.getGeoPusherSupport().pusherConfig.setUserName(userName);
            },
            null
            // {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId}
        );
        if (!this.pusher) {
            console.log("createPusherClient failed in StartupLeaflet");
        }
        // }
    };

}
