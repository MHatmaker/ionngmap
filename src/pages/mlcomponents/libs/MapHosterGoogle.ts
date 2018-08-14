import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
import { PusherEventHandler } from './PusherEventHandler';
// import { utils } from './utils';
import { ImlBounds } from '../../../services/mlbounds.service';
// import { ConfigParams } from '../../../services/configparams.service';
// import { GoogleMap, Size, Point, LatLngLiteral, LatLng, LatLngBounds } from '@agm/core/services/google-maps-types';
// import { createClient, GoogleMapsClient } from '@google/maps';
// import { GeoCoder } from './GeoCoder';
// import { GeoCodingService } from '../../../services/GeoCodingService';
// import { IPositionParams, IPositionData } from '../../../services/positionupdate.interface';
import { PositionUpdateService } from '../../../services/positionupdate.service';
// import { PusherEventHandler } from './PusherEventHandler';
import { MapHoster } from './MapHoster';
import { GeoPusherSupport, IGeoPusher } from './geopushersupport';
import { GeoCodingService, OSMAddress } from '../../../services/GeoCodingService';
import { Observable } from 'rxjs/Observable';
import { MapLocOptions } from '../../../services/positionupdate.interface';

declare var google;

// @Injectable()
export class MapHosterGoogle extends MapHoster {
    hostName = "MapHosterGoogle";
    scale2Level = [];
    mphmap : any;
    google;
    mapReady = true;
    zmG = -1;
    userZoom = true;
    // mphmapCenter;
    cntrxG = null;
    cntryG = null;
    bounds = null;
    minZoom = null;
    maxZoom = null;
    zoomLevels = null;
    popup = null;
    marker = null;
    markers = [];
    popups = [];
    mrkr = null;
    CustomControl = null;
    queryListenerLoaded = false;
    searchBox = null;
    // searchInput = null,
    searchFiredFromUrl = false;
    selfPusherDetails = {
        channelName : null,
        pusher : null
    };
    popDetails = null;
    queryPlaces = {
        location: null,
        bounds: null,
        query: 'what do you want?'
    };
    placesFromSearch = [];
    // private geoCoder = createClient();
    mlconfig : MLConfig;
    geopushSup : IGeoPusher;
    pusherEventHandler : PusherEventHandler;
    self : any;
    boundsListenerHandle : any;
    adrs : string;
    im : 'http://www.robotwoods.com/dev/misc/bluecircle.png';

    constructor(private mapNumber: number, mlconfig: MLConfig, geopush: GeoPusherSupport) {
        super(geopush);
        this.mlconfig = mlconfig;
        this.self = this;
        this.geopushSup = geopush.getGeoPusherSupport();
    }

    updateGlobals(msg : string, cntrx : number, cntry : number, zm : number) {
        console.log("updateGlobals ");
        let gmBounds = this.mphmap.getBounds();
        var
            mapLinkrBounds : ImlBounds = {urx: -1, ury: -1, llx: -1, lly: -1},
            ne,
            sw;
        if (gmBounds) {
            ne = gmBounds.getNorthEast();
            sw = gmBounds.getSouthWest();
            // bounds = gmBounds;
            mapLinkrBounds.llx = sw.lng();
            mapLinkrBounds.lly = sw.lat();
            mapLinkrBounds.urx = ne.lng();
            mapLinkrBounds.ury = ne.lat();
        }
        this.zmG = zm;
        this.cntrxG = cntrx;
        this.cntryG = cntry;
        console.log("Updated Globals " + msg + " " + this.cntrxG + ", " + this.cntryG + " : " + this.zmG);
        // this.geopushSup.positionUpdateService.positionData.emit(
        //     {'key' : 'zm',
        //       'val' : {
        //         'zm' : this.zmG,
        //         'scl' : this.scale2Level.length > 0 ? this.scale2Level[this.zmG].scale : 3,
        //         'cntrlng' : this.cntrxG,
        //         'cntrlat': this.cntryG,
        //         'evlng' : this.cntrxG,
        //         'evlat' : this.cntryG
        //   }
        // });
        this.mlconfig.setPosition({'lon' : this.cntrxG, 'lat' : this.cntryG, 'zoom' : this.zmG});
        this.mlconfig.setBounds(mapLinkrBounds);
    }

    showGlobals(cntxt) {
        console.log(cntxt + " Globals : lon " + this.cntrxG + " lat " + this.cntryG + " zoom " + this.zmG);
    }

    collectScales(levels) {
        this.scale2Level = [];
        var sc2lv = this.scale2Level,
        // var topLevel = ++levels;
            topLevel = levels + 2,
            scale = 1128.497220,
            i,
            obj;
        for (i = topLevel; i > 0; i -= 1) {
            obj = {"scale" : scale, "level" : i};
            scale = scale * 2;
            // console.log("scale " + obj.scale + " level " + obj.level);
            sc2lv.push(obj);
        }
    }

    markerInfoPopup(pos, content, title, mrkr=null) {
        var popId = "id" + title,
            shareBtnId = "idShare" + title,
            contentString = '<div id="content">' +
                '<h4 id="' + popId + '" style="color:forestgreen">' + title + '</h4>' +
                '<div id="bodyContent" style="color:darkmagenta">' +
                content + '<br><button class="sharebutton btn-primary" id="' + shareBtnId + '" >Share</button>' +
                '</div>' +
                '</div>',


            infowindow = new google.maps.InfoWindow({
                content: contentString
            }),

            marker = mrkr || new google.maps.Marker({
                position: pos,
                map: this.mphmap,
                title: title
            }),

            showSomething  = function (e: Event, self) {
                var
                    fixedLL,
                    referrerId,
                    referrerName,
                    pushLL;
                fixedLL = self.geopushSup.utils.toFixedTwo(marker.position.lng(), marker.position.lat(), 6);
                referrerId = self.mlconfig.getUserId();
                referrerName = self.geopushSup.pusherConfig.getUserName();
                pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : self.zmG,
                    "referrerId" : referrerId, "referrerName" : referrerName,
                    "mapId" : "map" + self.mlconfig.getMapId(),
                    'address' : marker.address, 'title' : marker.title };
                console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
                self.geopushSup.pusherClientService.publishClickEvent(pushLL);
            };


        google.maps.event.addListener(marker, 'click',  (event) => {
            var btnShare;
                // referrerId,
                // usrId;
            infowindow.setContent(contentString);
            infowindow.setPosition(event.latLng);
            infowindow.open(this.mphmap, marker);

            btnShare = document.getElementById(shareBtnId);
            // referrerId = this.mlconfig.getReferrerId();
            // usrId = this.mlconfig.getUserId();
            // if (referrerId && referrerId != usrId) {
                // if (btnShare) {
                //     console.debug(btnShare);
                //     btnShare.style.visibility = 'hidden';
                // }
            // }
            // btnShare.onclick = function () {
            //     showSomething();
            // };

            btnShare.addEventListener('click', (e:Event) => showSomething(e, this));
        });
        return { "infoWnd" : infowindow, "infoMarker" : marker};
    }

    placeMarkers(places) {
        var boundsForMarkers,
            image,
            marker,
            place,
            i;
        for (i = 0; i < this.markers.length; i += 1) {
            marker = this.markers[i];
            if (marker) {
                marker.setMap(null);
            }
        }

        // For each place, get the icon, place name, and location.
        this.markers = [];
        boundsForMarkers = new google.maps.LatLngBounds();
        for (i = 0; i < places.length; i += 1) {
            place = places[i];
            if (place) {
                image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

              // Create a marker for each place.
                marker = new google.maps.Marker({
                    map: this.mphmap,
                    icon: image,
                    title: place.name,
                    // address : place.formatted_address,
                    position: place.geometry.location
                });

                this.markers.push(marker);
                this.markerInfoPopup(place.geometry.location, marker.address, marker.title, marker);

                boundsForMarkers.extend(place.geometry.location);
            }
        }
    }

    placesQueryCallback(results, status) {
        console.log('status is ' + status);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results && results.length > 0) {
                console.log('PlacesService returned ' + results.length);
                this.placeMarkers(results);
            } else {
                console.log('placesService() returned no results');
            }
        }
    }


    addInitialSymbols() {
        var popPt = new google.maps.LatLng(41.890283, -87.625842),
            hint = "Lofty Thoughts";
        this.markerInfoPopup(popPt, "Creativity is inspired by collapsing ceilings and rubble walls.", hint);
        popPt = new google.maps.LatLng(41.888941, -87.620692);
        hint = "Drafty Sweatbox";
        this.markerInfoPopup(popPt, "Climate control as nature intended.", hint);
        popPt = new google.maps.LatLng(41.884979, -87.620950);
        hint = "Blank Wall Vistas";
        this.markerInfoPopup(popPt, "Panorama views are over-rated if you prefer exposed brick.", hint);
        // this.polygon([
            // [51.509, -0.08],
            // [51.503, -0.06],
            // [51.51, -0.047]
        // ]);
        // this.circle([51.508, -0.11], 500);
    }

    // formatBounds(b) {
    //     var s = String.format("ll : {0}, {1}, ru : {2}, {3}",
    //                         b.getSouthWest().lng(), b.getSouthWest().lat(),
    //                         b.getNorthEast().lng(), b.getNorthEast().lat());
    //     return s;
    // }

    extractBounds(action) {
        var zm = this.mphmap.getZoom(),
            cntr = this.mphmap.getCenter(),
            fixedLL = this.geopushSup.utils.toFixedTwo(cntr.lng(), cntr.lat(), 6),
            bnds = this.mphmap.getBounds(),
            xtntDict = {
                'src' : 'google',
                'zoom' : zm,
                'lon' : fixedLL.lon,
                'lat' : fixedLL.lat,
                'scale': this.scale2Level[zm].scale,
                'action': action,
                'bounds': bnds
            };
        return xtntDict;
    }

    compareExtents(msg, xtnt) {
        var cmp = true,
            gmBounds = this.mphmap.getBounds(),
            ne,
            sw,
            wdth,
            hgt,
            lonDif,
            latDif;

        if (gmBounds) {
            ne = gmBounds.getNorthEast();
            sw = gmBounds.getSouthWest();
            cmp = xtnt.zoom === this.zmG;
            wdth = Math.abs(ne.lng() - sw.lng());
            hgt = Math.abs(ne.lat() - sw.lat());
            if(!(wdth === 0 || hgt === 0)) {
                lonDif = Math.abs((xtnt.lon - this.cntrxG) / wdth);
                latDif =  Math.abs((xtnt.lat - this.cntryG) / hgt);
                // cmp = ((cmp == true) && (xtnt.lon == this.cntrxG) && (xtnt.lat == this.cntryG));
                cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
                console.log("compareExtents " + msg + " " + cmp);
          }
        }
        return cmp;
    }

    setBounds(action) {
        console.log("MapHosterGoogle setBounds with  " + this.pusherEventHandler.getMapNumber());
        if (this.mapReady === true) {
            // runs this code after you finishing the zoom
            var xtExt = this.extractBounds(action),
                xtntJsonStr = JSON.stringify(xtExt),
                cmp,
                service,
                qtext,
                gBnds,
                triggered;
            console.log("extracted bounds " + xtntJsonStr);
            cmp = this.compareExtents("MapHosterGoogle " + this.mlconfig.getMapNumber() + " setBounds", xtExt);
            if (cmp === false) {
                console.log("MapHoster Google setBounds " + this.mlconfig.getMapNumber() + " pusher send to channel " + this.selfPusherDetails.channelName);
                if (this.selfPusherDetails.pusher) {
                    triggered = this.selfPusherDetails.pusher.channel(this.selfPusherDetails.channelName).trigger('client-MapXtntEvent', xtExt);
                    console.log("triggered?");
                    console.log(triggered);
                }
                this.geopushSup.pusherClientService.publishPanEvent(xtExt);
                this.updateGlobals("in setBounds with cmp false", +xtExt.lon, +xtExt.lat, xtExt.zoom);

                gBnds = this.mphmap.getBounds();
                console.debug(gBnds);
                // ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                // ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                // gBnds = new google.maps.LatLngBounds(ll, ur);
                qtext = this.mlconfig.query();
                if (qtext && qtext !== "") {
                    this.queryPlaces.bounds = gBnds;
                    this.queryPlaces.query = qtext;
                    this.queryPlaces.location = this.mphmap.getCenter();
                    service = new google.maps.places.PlacesService(this.mphmap);
                    service.textSearch(this.queryPlaces, this.placesQueryCallback);
                }
            }
        }
    }

    hideLoading(error = null) {
        console.log("hide loading");
        this.geopushSup.utils.hideLoading(error);
    }

    retrievedBoundsInternal(xj) {
        console.log("Back in MapHosterGoogle " + this.mlconfig.getMapNumber() + " retrievedBounds");
        if (xj.zoom === '0') {
            xj.zoom = this.zmG;
        }
        var zm = xj.zoom,
            tmpLon,
            tmpLat,
            tmpZm,
            cntr,
            gBnds,
            qtext,
            service,
            cmp = this.compareExtents("retrievedBounds", {'zoom' : zm, 'lon' : xj.lon, 'lat' : xj.lat});
            // view = xj.lon + ", " + xj.lat + " : " + zm + " " + this.scale2Level[zm].scale;
            // document.getElementById("mppos").innerHTML = view;
        if (cmp === false) {
            tmpLon = this.cntrxG;
            tmpLat = this.cntryG;
            tmpZm = this.zmG;

            this.updateGlobals("in retrievedBounds with cmp false", xj.lon, xj.lat, xj.zoom);
            this.userZoom = false;
            cntr = new google.maps.LatLng(xj.lat, xj.lon);
            // this.userZoom = true;
            if (xj.action === 'pan') {
                if (tmpZm !== zm) {
                    this.mphmap.setZoom(zm);
                }
                this.mphmap.setCenter(cntr);

                gBnds = this.mphmap.getBounds();
                console.debug(gBnds);
                // ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                // ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                // gBnds = new google.maps.LatLngBounds(ll, ur);
                qtext = this.mlconfig.query();
                if (qtext && qtext !== "") {
                    this.queryPlaces.bounds = gBnds;
                    this.queryPlaces.query = qtext;
                    this.queryPlaces.location = this.mphmap.getCenter();
                    service = new google.maps.places.PlacesService(this.mphmap);
                    service.textSearch(this.queryPlaces, this.placesQueryCallback);
                }
            } else {
                if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                    this.mphmap.setCenter(cntr);
                }
                this.mphmap.setZoom(zm);
            }
            this.userZoom = true;
        }
    }

    retrievedClick(clickPt) {
        var fixedLL = this.geopushSup.utils.toFixedTwo(clickPt.x, clickPt.y, 6),
            content,
            popPt,
            btnShare;
        console.log("Back in retrievedClick - with click at " +  clickPt.x + ", " + clickPt.y);
        // latlng = L.latLng(clickPt.y, clickPt.x, clickPt.y);
        // $inj = this.mlconfig.getInjector();
        // linkrSvc = $inj.get('LinkrService');
        // linkrSvc.hideLinkr();

        popPt = new google.maps.LatLng(clickPt.y, clickPt.x);
        content = "Map click at " + fixedLL.lat + ", " + fixedLL.lon;
        if (clickPt.title) {
            content += '<br>' + clickPt.title;
        }
        if (clickPt.address) {
            content += '<br>' + clickPt.address;
        }
        if (this.popDetails !== null && clickPt.referrerId !== this.mlconfig.getUserId()) {
            this.popDetails.infoWnd.close();
            this.popDetails.infoMarker.setMap(null);
        }
        if (clickPt.referrerId) {  // !== this.mlconfig.getUserId()) {
            this.popDetails = this.markerInfoPopup(popPt, content, "Received from user " + clickPt.referrerName + ", " + clickPt.referrerId);
            this.popDetails.infoWnd.open(this.mphmap, this.popDetails.infoMarker);

            btnShare = document.getElementsByClassName('sharebutton')[0];
            if (btnShare) {
                console.debug(btnShare);
                btnShare.style.visibility = 'hidden';
            }
        }
    }

    setCurrentLocation( loc : MapLocOptions) {
      let cntr = new google.maps.LatLng(loc.center.lat, loc.center.lng);
      // this.updateGlobals("setCurrentLocation", loc.center.lng, loc.center.lat, this.zmG);
      this.mphmap.panTo(cntr);
      var userMarker = new google.maps.Marker({
            position: cntr,
            map: this.mphmap,
            icon: this.im
        });
      this.setBounds('pan');
    }

    configureMap(gMap, mapOptions, goooogle, googPlaces, config) {
        console.log("MapHosterGoogle configureMap");
        var
            firstCntr : any,
            qlat : string,
            qlon : string,
            qzoom : string,
            initZoom : string = mapOptions.zoom,
            listener : any;

        this.mlconfig = config;
        this.self = this;
        this.mphmap = gMap;
        this.google = goooogle;
        // this.geoCoder = new google.maps.Geocoder();


        if (this.mlconfig.testUrlArgs()) {
            qlat = this.mlconfig.lat();
            qlon = this.mlconfig.lon();
            qzoom = this.mlconfig.zoom();
            initZoom = qzoom; //parseInt(qzoom, 10);
            this.updateGlobals("iin configureMap - nit with qlon, qlat", +qlon, +qlat, +qzoom);
        } else {
            if (mapOptions) {
                this.updateGlobals("in configureMap - MapHosterGoogle init with passed in mapOptions", mapOptions.center.lng(), mapOptions.center.lat(), +initZoom);
            } else {
                this.updateGlobals("in configureMap - MapHosterGoogle init with hard-coded values", +qlon, +qlat, +initZoom);
            }
        }
        firstCntr = new google.maps.LatLng(this.cntryG, this.cntrxG);
        this.mphmap.panTo(firstCntr);
        this.mphmap.setCenter(firstCntr);
        // LocateSelfCtrl.setMap(goooogle, this.mphmap);

        // this.updateGlobals("init", -0.09, 51.50, 13, 0.0);
        this.showGlobals("MapHosterGoogle - Prior to new Map");
        // google.maps.event.addListener(this.mphmap, 'end', gotDragEnd);

        // Maybe it will work at this point!!!

        this.minZoom = this.maxZoom = this.zoomLevels = 0;

        this.maxZoom = 21;
        this.zoomLevels = this.maxZoom - this.minZoom;
        this.collectScales(this.zoomLevels);
        this.mlconfig.showConfigdetails('MapHosterGoogle - after collectScales');
        this.showGlobals("after collectScales");
        this.mphmap.setZoom(+initZoom);

        /*

        google.maps.event.addListenerOnce(gMap, 'zoom_changed', function() {
            var oldZoom = gMap.getZoom();
            gMap.setZoom(oldZoom - 1); //Or whatever
        });
        */

        function placeCustomControls() {
          /*
            var $inj = this.mlconfig.getInjector(),
                ctrlSvc = $inj.get('MapControllerService'),
                mapCtrl = ctrlSvc.getController();
            setTimeout(function () {
                mapCtrl.placeCustomControls();
            }, 500);
            */
        }

        function setupQueryListener() {
          /*
            var $inj = this.mlconfig.getInjector(),
                ctrlSvc = $inj.get('MapControllerService'),
                mapCtrl = ctrlSvc.getController();
            mapCtrl.setupQueryListener('google');
            */
        }

        function fillMapWithMarkers(places) {
            if(places) {
                this.placeMarkers(places);
            }
          /*
            var $inj = this.mlconfig.getInjector(),
                ctrlSvc = $inj.get('MapControllerService'),
                mapCtrl = ctrlSvc.getController();
            mapCtrl.fillMapWithMarkers();
            */
        }

        google.maps.event.addListenerOnce(this.mphmap, 'tilesloaded', () => {
            var zsvc = new google.maps.MaxZoomService(),
                cntr = new google.maps.LatLng(this.cntryG, this.cntrxG), // {lat: this.cntryG, lng: this.cntrxG}, //
                center,
                gmQuery = this.mlconfig.query(),
                bnds,
                gBnds,
                ll,
                ur,
                // pacinput,
                qtext,
                service;
            console.log(">>>>>>>>>>>>>> tiles loaded >>>>>>>>>>>>>>>>>>>>");

            this.hideLoading();
            this.mapReady = true;
            center = this.mphmap.getCenter();
            // google.maps.event.trigger(this.mphmap, 'resize');
            // this.mphmap.setCenter(center);
            this.addInitialSymbols();
            // google.maps.event.trigger(this.mphmap, 'resize');
            // this.mphmap.setCenter(center);
            gmQuery = this.mlconfig.query();
            console.log("getMaxZoomAtLatLng for " + cntr.lng() + ", " + cntr.lat());

            zsvc.getMaxZoomAtLatLng(cntr,  (response) => {
                console.log("zsvc.getMaxZoomAtLatLng returned response:");
                console.debug(response);
                if (response && response.status === google.maps.MaxZoomStatus.OK) {
                    this.maxZoom = response.zoom;
                    this.zoomLevels = this.maxZoom - this.minZoom;
                    this.collectScales(this.zoomLevels);
                    // this.mlconfig.showConfigDetails('MapHosterGoogle zsvc.getMaxZoomAtLatLng - after collectScales');
                    this.showGlobals("after zsvc.getMaxZoomAtLatLng collectScales");
                } else {
                    if (response) {
                        // alert("getMaxZoomAtLatLng service returned status other than OK");
                        console.log("getMaxZoomAtLatLng service returned status other than OK");
                        console.log(response.status);
                        console.log("zoom level returned " + response.zoom);
                        this.maxZoom = response.zoom || this.mphmap.getZoom();
                        console.log("used zoom level " + this.mphmap.getZoom());
                        this.zoomLevels = this.maxZoom - this.minZoom;
                        this.collectScales(this.zoomLevels);
                        this.showGlobals("after zsvc.getMaxZoomAtLatLng failure and collectScales");
                    } else {
                        alert("getMaxZoomAtLatLng service returned null");
                    }

                }
            });

            console.log('gmQuery contains ' + gmQuery);
        // searchInput = (document.getElementById('pac-input' + this.mlconfig.getMapNumber()));
        // this.mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
        // searchInput.value = '';
            if (gmQuery !== '') {
                this.searchFiredFromUrl = true;
                this.mlconfig.setQuery(gmQuery);
            }
            if (this.searchFiredFromUrl === true) {
                console.log("getBoundsFromUrl.......in MapHosterGoogle 'places_changed' listener");
                bnds = this.mlconfig.getBoundsFromUrl();
                console.debug(bnds);
                ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                gBnds = new google.maps.LatLngBounds(ll, ur);
                this.searchFiredFromUrl = false;

                qtext = this.mlconfig.query();
/* this is the previously functional location for accessing pac-input
                pacinput = angular.element('pac-input' + this.mlconfig.getMapNumber());
                pacinput.value = qtext;
*/
                // pacinput.focus();
                this.queryPlaces.bounds = gBnds;
                this.queryPlaces.query = qtext;
                this.queryPlaces.location = center;
                service = new google.maps.places.PlacesService(this.mphmap);
                service.textSearch(this.queryPlaces, this.placesQueryCallback);
            }

            // setupQueryListener();
            placeCustomControls();
            let initialPlaces = this.mlconfig.getInitialPlaces();
            if( initialPlaces) {
                this.placeMarkers(initialPlaces);
              }
        });

        setupQueryListener();
        // var bndsInit = createBounds();
        // this.mphmap.fitBounds(bndsInit);
        /*
        listener = this.mphmap.addListener("idle",  () => {
            console.log("Entering idle listener");
            // var center = this.mphmap.getCenter();
            var idleFirstCntr = new google.maps.LatLng(this.cntryG, this.cntrxG);
            this.mphmap.setCenter(idleFirstCntr);
            // this.mphmap.setZoom(12);
            this.mphmap.setZoom(initZoom);
            console.log("bounds in idle");
            console.debug(this.mphmap.getBounds());
            this.boundsListenerHandle.remove(listener);
        });
        */

        // searchInput = (document.getElementById('pac-input' + this.mlconfig.getMapNumber()));
        // this.mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
        // searchInput.value = '';
        // searchBox = new gplaces.SearchBox(/** @type {HTMLInputElement} */
        //     (searchInput));
        // searchBox = MapCtrl.getSearchBox();

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        this.boundsListenerHandle = this.mphmap.addListener('bounds_changed',  () => {
            var changedBounds = this.mphmap.getBounds(),
                convertedBounds;
            // console.debug(changedBounds);
            if (this.searchBox) {
                this.searchBox.setBounds(changedBounds);
            }
            convertedBounds = {'llx' : changedBounds.getSouthWest().lng(), 'lly' : changedBounds.getSouthWest().lat(),
                         'urx' : changedBounds.getNorthEast().lng(), 'ury' : changedBounds.getNorthEast().lat()};
            this.mlconfig.setBounds(convertedBounds);
        });

        this.mphmap.addListener('dragend',  () => {
            console.log("DRAG END");
            if (this.userZoom === true) {
                this.setBounds('pan');
            }
        });
        this.mphmap.addListener("zoom_changed", () => {
            if (this.userZoom === true) {
                if (this.scale2Level.length > 0) {
                    this.setBounds('zoom');
                }
            // this.userZoom = true;
            }
        });

        // google.maps.event.addListener(this.mphmap, 'resize', gotResize); //function() {
        //     console.log("resize event hit");
        //     console.log(this.mphmap.getBounds());
        // });

        // google.maps.event.addDomListener(window, 'resize', function () {
        //     gotResize();
            // console.log("resize event hit");
            // console.log(this.mphmap.getBounds());
        // });
        google.maps.event.addDomListener(window, 'resize', () => {
            var center = this.mphmap.getCenter();
            google.maps.event.trigger(this.mphmap, "resize");
            this.mphmap.setCenter(center);
        })

        this.mphmap.addListener("mousemove", (e) => {
            var ltln = e.latLng,
                fixedLL = this.geopushSup.utils.toFixedTwo(ltln.lng(), ltln.lat(), 4),
                evlng = fixedLL.lon,
                evlat = fixedLL.lat,
                zm = this.mphmap.getZoom(),
                cntr = this.mphmap.getCenter(),
                fixedCntrLL = this.geopushSup.utils.toFixedTwo(cntr.lng(), cntr.lat(), 4),
                cntrlng = fixedCntrLL.lon,
                cntrlat = fixedCntrLL.lat;

            if (this.scale2Level.length > 0) {
                // var view = "Zoom : " + zm + " Scale : " + this.scale2Level[zm].scale + " Center : " + cntrlng + ", " + cntrlat + " Current : " + evlng + ", " + evlat;
                // document.getElementById("mppos").value = view;
                this.geopushSup.positionUpdateService.positionData.emit({key: 'coords',
                    val: {
                        'zm' : zm,
                        'scl' : this.scale2Level[zm].scale,
                        'cntrlng' : cntrlng,
                        'cntrlat': cntrlat,
                        'evlng' : evlng,
                        'evlat' : evlat
                    }});
            }
        });

        this.mphmap.addListener('click',  (event) => {
            this.onMapClick(event);
        });

        this.pusherEventHandler = new PusherEventHandler(this.mlconfig.getMapNumber());
        console.log("Add pusher event handler for MapHosterGoogle " + this.mlconfig.getMapNumber());

        this.pusherEventHandler.addEvent('client-MapXtntEvent', (xj) => this.retrievedBoundsInternal(xj));
        this.pusherEventHandler.addEvent('client-MapClickEvent',  (clickPt) => this.retrievedClick(clickPt));
        /*
        createBounds() {
            var createdBounds = new google.maps.LatLngBounds(),
                testPts = [

                    new google.maps.LatLng(41.890283, -87.625842),
                    new google.maps.LatLng(41.888941, -87.620692),
                    new google.maps.LatLng(41.884979, -87.620950)
                ],
                i;

            for (i = 0; i < 3; i++) {
                createdBounds.extend(testPts[i]);
            }
            return createdBounds;
        }
        */
//    }
    /*
    gotDragEnd() {
        console.log("dragend event hit");
        setBounds('pan');
    }
    */

    }
       gotResize() {
            var center = this.mphmap.getCenter();
            google.maps.event.trigger(this.mphmap, "resize");
            this.mphmap.setCenter(center);
            // console.log(this.mphmap.getBounds());
        }
        showClickResult(content, popPt, marker) {
            if (this.popDetails !== null) {
                this.popDetails.infoWnd.close();
                this.popDetails.infoMarker.setMap(null);
            }
            this.popDetails = this.markerInfoPopup(popPt, content, "Ready to Push Click", marker);
            // this.popDetails.infoWnd.open(this.mphmap, this.popDetails.infoMarker);
            // if (this.selfPusherDetails.pusher)
            // {
                // var fixedLL = this.utils.toFixedTwo(popPt.lng(), popPt.lat(), 6);
                // var referrerId = this.mlconfig.getUserId();
                // var referrerName = PusherConfig.getUserName();
                // var pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : "0",
                    // "referrerId" : referrerId, "referrerName" : referrerName };
                // console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
                // this.selfPusherDetails.pusher.channel(this.selfPusherDetails.channelName).trigger('client-MapClickEvent', pushLL);
            // }
        }



        onMapClick(e) {
            var popPt = e.latLng,
                popPtRaw = {lat: popPt.lat(), lng: popPt.lng()},
                fixedLL = this.geopushSup.utils.toFixedTwo(popPt.lng(), popPt.lat(), 6),
                marker,
                adrs : string,
                content = "You clicked the map at " + fixedLL.lat + ", " + fixedLL.lon,
                options = {
                     method: 'GET',
                     url: 'https://maps.googleapis.com/maps/api/geocode/json',
                     qs: {
                     latlng: popPt,
                     key: 'AIzaSyAwAOGAxY5PZ8MshDtaJFk2KgK7VYxArPA'
                     }
                  };

                  // this.geopushSup.geoCoder.GeocoderRequest
                this.geopushSup.geoCoder.geocode({location: popPtRaw}).subscribe(data => {
                    this.adrs = adrs = data.display_name
                    console.log(this.adrs);

                    // map((res: Observable<OSMAddress>) => Observable<OSMAddress>res.json().results.map()))
                    const result = this.adrs; //s[0];
                    console.log(result);
                        // location = result.geometry.location;

                    if(result) {
                        marker = new google.maps.Marker({
                            map: this.mphmap,
                            // title: "",
                            title : this.adrs,
                            position: popPtRaw
                        });

                        content = this.adrs;
                        this.showClickResult(content, popPt, marker);
                    } else {
                        this.showClickResult(content, popPt, null);
                    }
                });
;
            // showClickResult(content, popPt);
        }

    getMapHosterName() {
        return "hostName is " + this.hostName;
    }

    getMap() {
        return this.mphmap;
    }

    getEventDictionary() {
        var eventDct = this.pusherEventHandler.getEventDct();
        return eventDct;
    }
/*
    getBoundsZoomLevel(bounds) {
        var GLOBE_HEIGHT = 256, // Height of a google map that displays the entire world when zoomed all the way out
            GLOBE_WIDTH = 256, // Width of a google map that displays the entire world when zoomed all the way out

            ne = bounds.getNorthEast(),
            sw = bounds.getSouthWest(),
            latZoomLevel,
            lngZoomLevel,
            lngAngle = ne.lng() - sw.lng(),
            latAngle = ne.lat() - sw.lat();

        if (latAngle < 0) {
            latAngle += 360;
        }
        latZoomLevel = Math.floor(Math.log(this.mphmap.height * 360 / latAngle / GLOBE_HEIGHT) / Math.LN2);
        lngZoomLevel = Math.floor(Math.log(this.mphmap.width * 360 / lngAngle / GLOBE_WIDTH) / Math.LN2);

        return (latZoomLevel < lngZoomLevel) ? latZoomLevel : lngZoomLevel;
    }
*/

    /*
    polygon(coords) {
        var arrayLatLng = [],
            i,
            pgn;
        for (i = 0; i < coords.length; i++) {
            arrayLatLng.push(new google.maps.LatLng(coords[i][0], coords[i][1]));
        }
        pgn = new google.maps.Polygon({
            paths: arrayLatLng,
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: "#FF0000",
            fillOpacity: 0.25
        });

        pgn.setMap(this.mphmap);
    }

    circle(cntr, rds) {
        var cntrLatLng = new google.maps.LatLng(cntr[0], cntr[1]),
            crcl = new google.maps.Circle({
                center: cntrLatLng,
                radius: rds,
                strokeColor: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            });

        crcl.setMap(this.mphmap);
    }
    */


    setUserName(name) {
        this.geopushSup.pusherConfig.setUserName(name);
    }

    getGlobalsForUrl() {
        return "&lon=" + this.cntrxG + "&lat=" + this.cntryG + "&zoom=" + this.zmG;
    }

    getCenter() {
        var pos = { 'lon' : this.cntrxG, 'lat' : this.cntryG, 'zoom' : this.zmG};
        console.log("return accurate center from getCenter()");
        console.debug(pos);
        return pos;
    }

    formatCoords(pos) {
        var fixed = this.geopushSup.utils.toFixedTwo(pos.lng, pos.lat, 5),
            formatted  = '<div style="color: blue;">' + fixed.lon + ', ' + fixed.lat + '</div>';
        return formatted;
    }

    geoLocate(pos) {
        var infoWindow = new google.maps.InfoWindow();
        infoWindow.setPosition(pos);
        infoWindow.setContent(this.formatCoords(pos));
        this.mphmap.setCenter(pos);
        this.mphmap.setZoom(14);
        this.updateGlobals('geoLocate just happened', pos.lng, pos.lat, 15);
    }

    publishPosition(pos) {
        var gmQuery,
            pubBounds;
        if (this.selfPusherDetails.pusher) {
            console.log("MapHosterGoogle.publishPosition");
            console.log(pos);

            gmQuery = this.mlconfig.query();
            if (gmQuery !== '') {
                console.log("adding gmQuery : " + gmQuery);
                pos.gmquery = gmQuery;
                pos.search += "&gmquery=" + gmQuery;
                pubBounds = this.mlconfig.getBoundsForUrl();
                pos.search += pubBounds;
            }
            console.log('After adding gmQuery');
            console.debug(pos.search);

            this.selfPusherDetails.pusher.channel(this.selfPusherDetails.channelName).trigger('client-NewMapPosition', pos);
        }

    }

    retrievedBounds(xj) {
        return this.retrievedBoundsInternal(xj);
    }

    getSearchBounds() {
        console.log("MapHosterGoogle getSearchBounds");
        var bounds = this.mphmap.getBounds();
        console.debug(bounds);
        return bounds;
    }

    setSearchBox(sbox) {
        this.searchBox = sbox;
    }

    setPlacesFromSearch(places) {
        this.placesFromSearch = places;
        console.log("in setPlacesFromSearch");
        console.log(this.placesFromSearch);
    }

    // MapHosterGoogle() {
    //     mapReady = false;
    //     // bounds = null;
    //     this.userZoom = true;
    // }

    removeEventListeners() {
        console.log("empty removeEventListeners block in MapHosterGoogle");
    }

    getPusherEventHandler() {
        return this.pusherEventHandler;
    }

    getmlconfig() : MLConfig {
        return this.mlconfig;
    }
}
