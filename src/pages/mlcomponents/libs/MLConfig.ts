// import {
//     Injectable,
// } from '@angular/core';
import { IPosition, MLPosition } from "../../../services/position.service";
import { IConfigParams, EMapSource } from "../../../services/configparams.service";
import { ImlBounds } from "../../../services/mlbounds.service";
import {utils } from "./utils";
import { AppModule } from '../../../app/app.module'
console.log("loading MLConfig");

// @Injectable()
export class MLConfig {
    private utils : utils;
    private details = {
        mapId :  -1, //this.ndx,
        userId : "",
        userName : "",
        referrerId : "",
        referrerName : "",
        source : 0,
        isInitialUser : true,
        url : "",
        locationPath : "",
        maphost : "",
        masherChannel : "",
        query : "",
        places : null,
        bounds : {llx : -1, lly : -1, urx : -1, ury : -1, getCenter : null},
        mapType : 'google',
        rawMap : null,
        mapHosterInstance : null,
        mapNumber: null,
        mapHoster : null,
        webmapId : "a4bb8a91ecfb4131aa544eddfbc2f1d0",
        mlposition : null,
        nginj : null,
        protocol : 'http',
        host : '', //"http://localhost",
        hostport : '3035',
        href : '', //"http://localhost",
        search: '/',
        startupView : {'summaryShowing' : true, 'websiteDisplayMode' : true},
        smallFormDimensions : { 'top' : 1, 'left' : 1, 'width' : 450, 'height' : 570},
        isHardInitialized : false
    };

    constructor (cfgparams : IConfigParams) {
      this.utils = AppModule.injector.get(utils);
        this.details.mlposition = cfgparams.mlposition;
        this.details.mapId = cfgparams.mapId;
        this.details.mapType = cfgparams.mapType;
        this.details.webmapId = cfgparams.webmapId;
        this.details.source = cfgparams.source;
    }

    setHardInitialized(tf : boolean) {
        this.details.isHardInitialized = tf;
    }
    isHardInitialized() : boolean {
        return this.details.isHardInitialized;
    }
    setMapId (id : number) {
        console.log("MLConfig setMapId to " + id);
        this.details.mapId = id;
        console.log("MapId is now " + this.details.mapId);
    }
    getMapId () : number {
        return this.details.mapId;
    }
    setMapType (type : string) {
        this.details.mapType = type;
    }
    getMapType () : string {
        return this.details.mapType;
    }
    setMapNumber (mapNo) {
        this.details.mapNumber = mapNo;
    }
    getMapNumber () : number {
        return this.details.mapNumber;
    }
    setMapHosterInstance (inst) {
        this.details.mapHosterInstance = inst;
        if (!inst) {
            console.log("attempting to setMapHosterInstance to null/undefined");
        }
        console.log("MLConfig.setMapHosterInstance is set to " + this.details.mapNumber);
        console.debug(this.details.mapHosterInstance);
    }
    getMapHosterInstance () {
        console.log("MLConfig.getMapHosterInstance is returning instance " + this.details.mapId);
        console.debug(this.details.mapHosterInstance);
        if (!this.details.mapHosterInstance) {
            console.log("attempting to getMapHosterInstance containing null/undefined");
        }
        return this.details.mapHosterInstance;
    }
    getWebmapId (newWindow : boolean) : string {
        let result = "";
        if (newWindow === true) {
            result = this.utils.getParameterByName('id', this.details.search);
            if (result === "") {
                result = this.details.webmapId;
            }
        } else {
            result = this.details.webmapId;
        }
        return result;
    }
    setWebmapId (id : string) {
        console.log("Setting webmapId to " + id);
        this.details.webmapId = id;
    }
    getUserId () : string {
        return this.details.userId;
    }
    setUserId (id : string) {
        this.details.userId = id;
    }
    setUserName (nm : string) {
        this.details.userName = nm;
    }
    getReferrerId () : string {
        return this.details.referrerId;
    }
    getReferrerIdFromUrl () : string{
        this.details.referrerId = this.utils.getParameterByName('referrerId', this.details.search);
        return this.details.referrerId;
    }
    setReferrerId (id : string) {
        this.details.referrerId = id;
    }
    getReferrerNameFromUrl () : string{
        this.details.referrerName = this.utils.getParameterByName('referrerName', this.details.search);
        return this.details.referrerName;
    }
    testUrlArgs () : boolean{
        let rslt = this.utils.getParameterByName('id', this.details.search);
        // alert("getParameterByName('id') = " + rslt);
        // alert(rslt.length);
        // alert(rslt.length != 0);

        console.log("getParameterByName('id') = " + rslt);
        console.log(rslt.length);
        console.log(rslt.length !== 0);
        return rslt.length !== 0;
    }

    setUrl (u : string) {
        this.details.url = u;
    }
    getUrl () : string {
        return this.details.url;
    }
    getbaseurl () : string{
        var baseurl = this.details.protocol + "//" + this.details.host + "/";
        console.log("getbaseurl --> " + baseurl);
        return baseurl;
    }
    sethost (h : string) {
        this.details.host = h;
        console.log("host : " + this.details.host);
    }
    gethost () : string {
        return this.details.host;
    }
    gethref () {
        let pos = this.details.href.indexOf("/arcgis");
        if (pos  > -1) {
            return this.details.href; //.substring(0, pos);
        }
        return this.details.href;
    }

    getQuery () {
        return this.details.query;
        // if (details.query.length === 0) {
        //     return "";
        // } else {
        //     return details.query[0];
        // }
    }
    getSearch() : string {
       return this.details.search;
    }
    setSearch(s : string) {
        this.details.search = s;
        this.details.query = this.utils.getParameterByName('gmquery', this.details.search);
    }
    getUpdatedRawUrl (channel : string) {
      let n = this.details.webmapId.length,
          id = this.details.webmapId == 'nowebmap' ? 'nowebmap' : this.details.webmapId.substr(0, n - 1),
          updatedUrl = "?id=" + id + "&lon=" + this.details.mlposition.lon + "&lat=" + this.details.mlposition.lat +
              "&zoom=" + this.details.mlposition.zoom + "&channel=" + channel;
      console.log(updatedUrl);
      return updatedUrl;
  }

    hasCoordinates () : boolean {
        var result = "";
        result = this.details.mlposition.zoom || this.utils.getParameterByName('zoom', this.details.mlposition);
        return result === "" ? false : true;
    }
    lon () : string{
        return this.utils.getParameterByName('lon', this.details.mlposition);
    }
    lat () : string {
        return this.utils.getParameterByName('lat', this.details.mlposition);
    }
    zoom () : string {
        return this.utils.getParameterByName('zoom', this.details.mlposition);
    }
    setConfigParams (config : IConfigParams) {
        this.details.mlposition.lon = config.mlposition.lon;
        this.details.mlposition.lat = config.mlposition.lat;
        this.details.mlposition.zoom = config.mlposition.zoom;
        this.details.mapId = config.mapId;
        this.details.mapType = config.mapType;
        this.details.webmapId = config.webmapId;
        this.details.source = config.source;
    }
    getConfigParams () : IConfigParams {
        return {
            "mapId" : this.details.mapId,
            "webmapId" : this.details.webmapId,
            "mapType" : this.details.mapType,
            "mlposition" : {
                "lon" : this.details.mlposition.lon,
                "lat" : this.details.mlposition.lat,
                "zoom" : this.details.mlposition.zoom},
            "source" : this.details.source,
            "bounds" : this.details.bounds
            }
    }
    getSource() : EMapSource {
        return this.details.source;
    }
    setSource(s : EMapSource) {
        this.details.source = s;
    }

    setPosition (position : IPosition) {
        this.details.mlposition.lon = position.lon;
        this.details.mlposition.lat = position.lat;
        this.details.mlposition.zoom = position.zoom;
    }
    getPosition () : IPosition {
    //     return new MLPosition({
    //             "lon" : this.details.mlposition.lon,
    //             "lat" : this.details.mlposition.lat,
    //             "zoom" : this.details.mlposition.zoom
    //         })
            return new MLPosition(this.details.mlposition.lon, this.details.mlposition.lat, this.details.mlposition.zoom);
    }

    setQuery (q : string) {
        this.details.query = q;
    }
    query () : string {
        return this.utils.getParameterByName('gmquery', this.details.search);
    }
    setInitialPlaces (p) {
        this.details.places = p;
    }
    getInitialPlaces() {
        return this.details.places;
    }
    getBoundsForUrl () : string {
        var bnds = this.details.bounds,
            bndsUrl = "&llx=" + bnds.llx + "&lly=" + bnds.lly + "&urx=" + bnds.urx + "&ury=" + bnds.ury;
        return bndsUrl;
    }
    getBoundsFromUrl () {
        var llx = this.utils.getParameterByName('llx', this.details.search),
            lly = this.utils.getParameterByName('lly', this.details.search),
            urx = this.utils.getParameterByName('urx', this.details.search),
            ury = this.utils.getParameterByName('ury', this.details.search);
        return {'llx' : llx, 'lly' : lly, 'urx' : urx, 'ury' : ury};
    }
    getSmallFormDimensions () : string {
        var d = this.details.smallFormDimensions,
            ltwh = 'top=${d.top}, left=${d.left}, height=${d.height}, width=${d.width}';
        return ltwh;
    }
    setBounds (bnds : ImlBounds) {
        this.details.bounds = bnds;
    }
    getBounds () : ImlBounds {
        return this.details.bounds;
    }
    setRawMap (rawMap) {
        this.details.rawMap = rawMap;
    }
    getRawMap ()  {
        return this.details.rawMap;
    }
    setInjector (inj) {
        this.details.nginj = inj;
    }
    getInjector () {
        return this.details.nginj;
    }
    setStartupView (sum, site) {
        this.details.startupView.summaryShowing = sum;
        this.details.startupView.websiteDisplayMode = site;
    }
    getStartupView () {
        return this.details.startupView;
    }

    getZoom() {
        return this.details.mlposition.zoom;
    }

    showConfigdetails (msg : string ) {
        console.log(msg);
        console.log(
            'isInitialUser ' + this.details.isInitialUser + "\n" +
                "referrerId : "  + this.details.referrerId + "\n" +
                "locationPath : "  + this.details.locationPath + "\n" +
                "host : "  + this.details.host + "\n" +
                "hostport : "  + this.details.hostport + "\n" +
                "href : "  + this.details.href + "\n"  +
                "search : "  + this.details.search + "\n" +
                "maphost : "  + this.details.maphost + "\n" +
                "webmapId : "  + this.details.webmapId + "\n" +
                "masherChannel : "  + this.details.masherChannel + "\n" +
                "lon :" + this.details.mlposition.lon + '\n' +
                "lat : " + this.details.mlposition.lat + "\n" +
                "zoom : " + this.details.mlposition.zoom +
                "startupView.summaryShowing : " + this.details.startupView.summaryShowing + ", startupView.websiteDisplayMode : " + this.details.startupView.websiteDisplayMode
        );
    }
        // staticMethods.showConfigthis.details = showConfigthis.details;


        // setInjector(angular.element(document.body).injector());
}
