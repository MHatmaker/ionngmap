/*global require, console, define, L, GeoCoder, google, document, angular*/
// define('leaflet', function () {
    // if (leaflet) {
        // return leaflet;
    // }
    // return {};
// });

// define('GeoCoder', function () {
//     "use strict";
//     if (GeoCoder) {
//         return GeoCoder;
//     }
//     return {};
// });

(function () {
    "use strict";
    console.log("ready to require stuff in MapHosterLeaflet");
    require(['http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js']); //, 'libs/GeoCoder', 'libs/MLConfig']);
    console.log("ready to define in MapHosterLeaflet");

    define([
        'controllers/PositionViewCtrl',
        'libs/GeoCoder',
        'libs/utils',
        'libs/PusherEventHandler',
        'libs/PusherConfig',
        'controllers/PusherSetupCtrl'
    ], function (PositionViewCtrl, GeoCoder, utils, PusherEventHandler, PusherConfig, PusherSetupCtrl) {
        console.log("about to set up MapHosterLeaflet pseudo-ctor method");
        var MapHosterLeaflet = function () {
            var
                hostName = "MapHosterLeaflet",
                scale2Level = [],
                zmG,
                userZoom = true,
                // mphmapCenter,
                cntrxG,
                cntryG,
                bounds,
                minZoom,
                maxZoom,
                zoomLevels,
                popup,
                geoCoder,
                marker = null,
                mphmap,
                markers = [],
                popups = [],
                mrkr,
                CustomControl = null,
                queryListenerLoaded = false,
                mlconfig,
                pusherEvtHandler;

            function showLoading() {
                utils.showLoading();
            }
            function hideLoading() {
                utils.hideLoading();
            }
            // MapHosterLeaflet.prototype.updateGlobals = function(msg, cntrx, cntry, zm)
            function updateGlobals(msg, cntrx, cntry, zm) {
                console.log("updateGlobals " + msg);
                var lfltBounds = mphmap.getBounds(),
                    ne,
                    sw;
                console.debug(lfltBounds);
                if (lfltBounds) {
                    ne = lfltBounds.getNorthEast();
                    sw = lfltBounds.getSouthWest();
                    bounds = lfltBounds;
                    lfltBounds.xmin = sw.lng;
                    lfltBounds.ymin = sw.lat;
                    lfltBounds.xmax = ne.lng;
                    lfltBounds.ymax = ne.lat;
                    mlconfig.setBounds({'llx' : sw.lng, 'lly' : sw.lat, 'urx' : ne.lng, 'ury' : ne.lat});
                }
                zmG = zm;
                cntrxG = cntrx;
                cntryG = cntry;
                console.log("Updated Globals " + msg + " " + cntrxG + ", " + cntryG + " : " + zmG);
                PositionViewCtrl.update('zm', {
                    'zm' : zmG,
                    'scl' : scale2Level.length > 0 ? scale2Level[zmG].scale : 3,
                    'cntrlng' : cntrxG,
                    'cntrlat': cntryG,
                    'evlng' : cntrxG,
                    'evlat' : cntryG
                });
                mlconfig.setPosition({'lon' : cntrxG, 'lat' : cntryG, 'zoom' : zmG});
            }

            function showGlobals(cntxt) {
                console.log(cntxt + " Globals : lon " + cntrxG + " lat " + cntryG + " zoom " + zmG);
            }

            function collectScales() {
                console.log('collectScales');
                var //zm = mphmap.getZoom(),
                    sc2lv,
                    scale,
                    obj,
                    i;
                scale2Level = [];
                sc2lv = scale2Level;
                for (i = 0; i < zoomLevels + 1; i += 1) {
                    scale = mphmap.options.crs.scale(i);
                    obj = {"scale" : scale, "level" : i};
                    // console.log("scale " + obj.scale + " level " + obj.level);
                    sc2lv.push(obj);
                }
            }


            function markerInfoPopup(pos, content, hint) {
                var shareBtnId = "idShare" + hint,
                    contentId = "idContent" + hint,
                    contextHint = hint,
                    contextContent = content,
                    container,
                    triggerPusher,
                    allContent = '<h4  style="color:#A0743C; visibility: visible">' + hint +
                        '</h4><div id="' + contentId + '" >' + content +
                        '</div><br><button class="trigger  btn-primary" id="' + shareBtnId + '">Share</button>',
                    contextPos = pos;

                mrkr = L.marker(pos).addTo(mphmap);


                triggerPusher = function () {
                    var fixedLL,
                        referrerId,
                        referrerName,
                        pushLL;
                    fixedLL = utils.toFixed(contextPos[1], contextPos[0], 6);
                    referrerId = mlconfig.getUserId();
                    referrerName = PusherConfig.getUserName();
                    pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : "0",
                        "referrerId" : referrerId, "referrerName" :  referrerName,
                        'address' : contextContent, 'title' : contextHint };
                    console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);

                    PusherSetupCtrl.publishCLickEvent(pushLL);
                };

                container = angular.element('<div />');
                container.html(allContent);

                popup = L.popup().setContent(container[0]);
                mrkr.bindPopup(popup);
                markers.push(mrkr);
                popups.push(popup);
                mphmap.on('popupopen', function () {
                    // alert('pop pop pop');
                    console.debug(popup);
                    var referrerId = mlconfig.getReferrerId(),
                        usrId = mlconfig.getUserId(),
                        btnShare = document.getElementById(shareBtnId);
                    if (referrerId && referrerId !== usrId) {
                        if (btnShare) {
                            console.debug(btnShare);
                            btnShare.style.visibility = 'visible';
                            btnShare.onclick = function () {
                                triggerPusher();
                            };
                        }

                    } else {
                        if (btnShare) {
                            console.debug(btnShare);
                            btnShare.style.visibility = 'hidden';
                        }
                    }
                });
            }

            function addInitialSymbols() {
                var hint = "Seanery Beanery Industrial Row";
                markerInfoPopup([41.8933, -87.6258], "Seanery Beanery with spectacular view of abandoned industrial site", hint);
                hint = "Seanery Beanery For Discriminating Beaners";
                markerInfoPopup([41.8789, -87.6206], "Seanery Beanery located adjacent to great entertainment venues", hint);
                hint = "Seanery Beanery For Walking Averse";
                markerInfoPopup([41.8749, -87.6190], "Seanery Beanery located close to the pedicab terminal", hint);

                // L.circle([51.508, -0.11], 500, {
                    // color: 'red',
                    // fillColor: '#f03',
                    // fillOpacity: 0.5
                // }).addTo(mphmap).bindPopup("I am a circle.");

                // L.polygon([
                    // [51.509, -0.08],
                    // [51.503, -0.06],
                    // [51.51, -0.047]
                // ], {
                    // color: 'blue',
                    // fillColor: '#00f',
                    // fillOpacity: 0.25
                // }).addTo(mphmap).bindPopup("I am a polygon.");

                popup = L.popup();
            }

            function onMouseMove(e) {
                var ltln = e.latlng,
                    fixedLL = utils.toFixed(ltln.lng, ltln.lat, 4),
                    evlng = fixedLL.lon,
                    evlat = fixedLL.lat,
                    zm = mphmap.getZoom(),
                    cntr = mphmap.getCenter(),
                    fixedCntrLL = utils.toFixed(cntr.lng, cntr.lat, 4),
                    cntrlng = fixedCntrLL.lon,
                    cntrlat = fixedCntrLL.lat;

                PositionViewCtrl.update('coords', {
                    'zm' : zm,
                    'scl' : scale2Level[zm].scale,
                    'cntrlng' : cntrlng,
                    'cntrlat': cntrlat,
                    'evlng' : evlng,
                    'evlat' : evlat
                });
            }

            function showClickResult(r) {
                var cntr;
                if (r) {
                    console.log("showClickResultp at " + r.lat + ", " + r.lon);
                    cntr = new L.latLng(r.lat, r.lon, 0);
                    if (marker) {
                        marker.closePopup();
                        markerInfoPopup([cntr.lat, cntr.lng], r.display_name, "The hint");
                    } else {
                        markerInfoPopup([cntr.lat, cntr.lng], r.display_name, "The hint");
                    }
                }
            }

            function onMapClick(e) {
                var r;
                geoCoder.reverse(e.latlng, mphmap.options.crs.scale(mphmap.getZoom())).
                    then(function (results) {
                        r = results;
                        showClickResult(r);
                    });
            }

            function extractBounds(action) { // , latlng) {
                var zm = mphmap.getZoom(),
                    // scale = mphmap.options.crs.scale(zm),
                    // oldMapCenter = mphmapCenter,
                    cntr,
                    fixedLL,
                    xtntDict = {};
                    // mphmapCenter = mphmap.getCenter();
                // var cntr = action == 'pan' ? latlng : mphmap.getCenter();
                cntr = mphmap.getCenter();
                fixedLL = utils.toFixed(cntr.lng, cntr.lat, 3);
                xtntDict = {
                    'src' : 'leaflet_osm',
                    'zoom' : zm,
                    'lon' : fixedLL.lon,
                    'lat' : fixedLL.lat,
                    'scale': scale2Level[zm].scale,
                    'action': action
                };
                return xtntDict;
            }

            function compareExtents(msg, xtnt) {
                var cmp = xtnt.zoom === zmG,
                    wdth = Math.abs(bounds.xmax - bounds.xmin),
                    hgt = Math.abs(bounds.ymax - bounds.ymin),
                    lonDif = Math.abs((xtnt.lon - cntrxG) / wdth),
                    latDif =  Math.abs((xtnt.lat - cntryG) / hgt);
                // cmp = ((cmp == true) && (xtnt.lon == this.cntrxG) && (xtnt.lat == this.cntryG));
                cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
                console.log("compareExtents " + msg + " " + cmp);
                return cmp;
            }

            function setBounds(action, latlng) {
                // runs this code after finishing the zoom
                var xtExt = extractBounds(action, latlng),
                    xtntJsonStr = JSON.stringify(xtExt),
                    cmp = compareExtents("setBounds", xtExt);
                console.log("extracted bounds " + xtntJsonStr);

                if (cmp === false) {
                    console.log("MapHoster Leaflet setBounds publishPanEvent");
                    PusherSetupCtrl.publishPanEvent(xtExt);
                    updateGlobals("setBounds with cmp false", xtExt.lon, xtExt.lat, xtExt.zoom);
                }
            }

            function retrievedClick(clickPt) {
                console.log("Back in retrievedClick - with a click at " +  clickPt.x + ", " + clickPt.y);
                var latlng = L.latLng(clickPt.y, clickPt.x, clickPt.y),
                    $inj,
                    linkrSvc,
                    content = "Received Pushed Click from user " + clickPt.referrerName + ", " + clickPt.referrerId + " at " + latlng.toString();

                $inj = PusherConfig.getInjector();
                linkrSvc = $inj.get('LinkrService');
                linkrSvc.hideLinkr();
                if (clickPt.title) {
                    content += '<br>' + clickPt.title;
                }
                if (clickPt.address) {
                    content += '<br>' + clickPt.address;
                }
                if (clickPt.referrerId !== mlconfig.getUserId()) {
                    popup
                        .setLatLng(latlng)
                        .setContent(content)
                        .openOn(mphmap);
                }
            }

            function retrievedBounds(xj) {
                console.log("Back in retrievedBounds");
                if (xj.zoom === '0') {
                    xj.zoom = zmG;
                }
                var zm = xj.zoom,
                    cmp = compareExtents("retrievedBounds", {'zoom' : zm, 'lon' : xj.lon, 'lat' : xj.lat}),

                    tmpLon,
                    tmpLat,
                    //tmpZm,
                    cntr;

                if (cmp === false) {
                    tmpLon = cntrxG;
                    tmpLat = cntryG;

                    updateGlobals("retrievedBounds with cmp false", xj.lon, xj.lat, xj.zoom);
                    userZoom = false;
                    cntr = new L.LatLng(xj.lat, xj.lon);

                    if (xj.action === 'pan') {
                        mphmap.setView(cntr, zm);
                    } else {
                        if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                            mphmap.setView(cntr, zm);
                        } else {
                            mphmap.setZoom(zm);
                        }
                    }
                    userZoom = true;
                }

                mlconfig.setPosition({'lon' : cntrxG, 'lat' : cntryG, 'zoom' : zmG});
            }

            CustomControl =  L.Control.extend({
                options: {
                    position: 'topright'
                },

                onAdd: function () { //map) {
                    var container = document.getElementById('gmsearch' + mlconfig.getMapNumber());
                    return container;
                }
            });

            function placeCustomControls() {
                var $inj = PusherConfig.getInjector(),
                    ctrlSvc = $inj.get('MapControllerService'),
                    mapCtrl = ctrlSvc.getController();
                mapCtrl.placeCustomControls();
            }

            function setupQueryListener() {
                var $inj = PusherConfig.getInjector(),
                    ctrlSvc = $inj.get('MapControllerService'),
                    mapCtrl = ctrlSvc.getController();
                mapCtrl.setupQueryListener('leaflet');
            }

            function configureMap(lmap, mapOptions, config) {
                var qlat, // = config.lat(),
                    qlon, // = config.lon(),
                    qzoom, // = config.zoom(),
                    osmUrl,
                    lyr;
                mlconfig = config;
                console.debug("ready to show leaflet mphmap");
                mphmap = lmap; //L.map('map_canvas').setView([51.50, -0.09], 13);
                console.debug(mphmap);
                showLoading();

                geoCoder =  GeoCoder; //.nominatim();

                if (mlconfig.testUrlArgs()) {
                    qlat = mlconfig.lat();
                    qlon = mlconfig.lon();
                    qzoom = mlconfig.zoom();
                    mphmap.setView([qlat, qlon], qzoom);
                    updateGlobals("init with qlon, qlat", qlon, qlat, qzoom);
                } else {
                    mphmap.setView([mapOptions.center.lat, mapOptions.center.lng], mapOptions.zoom);
                    updateGlobals("init with hard-coded values", mapOptions.center.lng, mapOptions.center.lat, mapOptions.zoom);
                }
                console.log(mphmap.getCenter().lng + " " +  mphmap.getCenter().lat);

                showGlobals("Prior to new Map");

                osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

                lyr = L.tileLayer(osmUrl, {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://cloudmade.com">CloudMade</a>'
                }).addTo(mphmap);
                lyr.on("load", function () {
                // setTimeout(function() {
                        placeCustomControls();
                        if (queryListenerLoaded === false) {
                            setupQueryListener();
                        } else {
                            queryListenerLoaded = true;
                        }
                    // }, 1000);
                    hideLoading();
                    // mphmap.addControl(new CustomControl());
                });

                lyr.on("loading", function () { //(e) {
                    showLoading();
                });

                minZoom = mphmap.getMinZoom();
                maxZoom = mphmap.getMaxZoom();
                zoomLevels = maxZoom - minZoom + 1;
                collectScales();
                bounds = mphmap.getBounds(); // returns LatLngBounds  -- also check getBoundsZoom(bounds, inside? bool)

                addInitialSymbols();

                console.log("again " + mphmap.getCenter().lng + " " +  mphmap.getCenter().lat);
                // mphmapCenter = mphmap.getCenter();
                mphmap.on("mousemove", function (e) {
                    onMouseMove(e);
                });
                mphmap.on("click", function (e) {
                    onMapClick(e);
                });
                mphmap.on("zoomend", function () { //e) {
                    if (userZoom === true) {
                        setBounds('zoom', null);
                    }
                });

                mphmap.on("moveend", function (e) {
                    if (userZoom === true) {
                        setBounds('pan', e.latlng);
                    }
                });
                pusherEvtHandler = new PusherEventHandler.PusherEventHandler(mlconfig.getMapNumber());
                console.log("Add pusher event handler for MapHosterGoogle " + mlconfig.getMapNumber());

                pusherEvtHandler.addEvent('client-MapXtntEvent', retrievedBounds);
                pusherEvtHandler.addEvent('client-MapClickEvent',  retrievedClick);
            }


            function getMapHosterName() {
                return "hostName is " + hostName;
            }
            function getMap() {
                console.log("Asking MapHosterLeaflet to return a google maphoster");
                return null;
            }

            function getEventDictionary() {
                var eventDct = pusherEvtHandler.getEventDct();
                return eventDct;
            }



            function setUserName(name) {
                mlconfig.setUserName(name);
            }

            function getGlobalsForUrl() {
                console.log(" MapHosterLeaflet.prototype.getGlobalsForUrl");
                console.log("&lon=" + cntrxG + "&lat=" + cntryG + "&zoom=" + zmG);
                return "&lon=" + cntrxG + "&lat=" + cntryG + "&zoom=" + zmG;
            }

            function formatCoords(pos) {
                var fixed = utils.toFixed(pos.lng, pos.lat, 5),
                    formatted  = '<div style="color: blue;">' + fixed.lon + ', ' + fixed.lat + '</div>';
                return formatted;
            }

            function geoLocate(pos) {
                var latlng = L.latLng(pos.lat, pos.lng);
                popup
                    .setLatLng(latlng)
                    .setContent(formatCoords(pos))
                    .openOn(mphmap);
                updateGlobals('geoLocate just happened', pos.lng, pos.lat, 15);
                mphmap.setView(latlng, 15);
                mphmap.panTo(latlng);
            }

            function publishPosition(pos) {
                console.log("MapHosterLeaflet.publishPosition");
                // pos['maphost'] = 'Leaflet';
                console.log(pos);

                var lfltBounds = mphmap.getBounds(),
                    bnds = {},
                    ne,
                    sw;
                console.debug(lfltBounds);
                if (lfltBounds) {
                    ne = lfltBounds.getNorthEast();
                    sw = lfltBounds.getSouthWest();

                    bounds = lfltBounds;
                    lfltBounds.xmin = sw.lng;
                    lfltBounds.ymin = sw.lat;
                    lfltBounds.xmax = ne.lng;
                    lfltBounds.ymax = ne.lat;

                    bnds = {'llx' : sw.lng, 'lly' : sw.lat,
                                 'urx' : ne.lng, 'ury' : ne.lat};
                    mlconfig.setBounds(bnds);
                }

                bnds = mlconfig.getBoundsForUrl();
                pos.search += bnds;

                PusherSetupCtrl.publishPosition(pos);
            }

            function getCenter() {
                var pos = { 'lon' : cntrxG, 'lat' : cntryG, 'zoom' : zmG};
                console.log("return accurate center from getCenter()");
                console.debug(pos);
                return pos;
            }


            function removeEventListeners(destWnd) {
                var ctrlDiv = document.getElementsByClassName("leaflet-control-container")[0],
                    paneDiv = document.getElementsByClassName("leaflet-map-pane")[0],
                    mapDiv = document.getElementById("map_canvas");
                if (destWnd === "Same Window") {
                    mphmap.removeEventListener();
                    ctrlDiv.remove();
                    paneDiv.remove();
                    mapDiv.classList.remove('leaflet-container');
                    mapDiv.classList.remove('leaflet-fade-anim');
                    mapDiv.classList.remove('map');
                }
            }

            function getPusherEventHandler() {
                return pusherEvtHandler;
            }

            return {
                config : configureMap,
                retrievedBounds: retrievedBounds,
                retrievedClick: retrievedClick,
                setUserName : setUserName,
                getGlobalsForUrl: getGlobalsForUrl,
                getEventDictionary : getEventDictionary,
                publishPosition : publishPosition,
                getCenter : getCenter,
                removeEventListeners : removeEventListeners,
                getMapHosterName : getMapHosterName,
                getMap : getMap,
                geoLocate : geoLocate,
                getPusherEventHandler : getPusherEventHandler
            };
        };

        return {
            MapHosterLeaflet : MapHosterLeaflet
        };
    });
}());
