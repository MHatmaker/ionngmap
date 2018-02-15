/*global require, define, console, google, navigator, alert, loading, document, setTimeout, angular, window*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log("ready to require/define stuff in MapHosterGoogle");
    // require(["libs/utils"]);
    // require(["lib/utils", 'angular', 'controllers/MapCtrl']);

    define([
        'controllers/PositionViewCtrl',
        'libs/utils',
        'libs/MLConfig',
        'libs/PusherConfig',
        'libs/PusherEventHandler',
        'controllers/PusherSetupCtrl',
        'controllers/LocateSelfCtrl'
    ], function (PositionViewCtrl, utils, MLConfig, PusherConfig, PusherEventHandler, PusherSetupCtrl, LocateSelfCtrl) {
        console.log("ready for psuedo-ctor MapHosterGoogle");
        var MapHosterGoogle  () {
            var
                hostName = "MapHosterGoogle",
                mphmap,
                google,
                mapReady = true,
                scale2Level = [],
                zoomLevels = 0,
                minZoom = 0,
                maxZoom,
                zmG,
                cntrxG,
                cntryG,
                // bounds,
                // channel,
                userZoom = true,
                geoCoder = null,
                searchBox = null,
                // searchInput = null,
                searchFiredFromUrl = false,

                selfPusherDetails = {
                    channelName : null,
                    pusher : null
                },
                popDetails = null,
                // selfMethods = {},
                queryPlaces = {
                    location: null,
                    bounds: null,
                    query: 'what do you want?'
                },
                placesFromSearch = [],
                markers = [],
                mlconfig,
                pusherEvtHandler;

            // MLConfig.showConfigDetails('MapHosterGoogle - startup');
            function updateGlobals(msg, cntrx, cntry, zm) {
                console.log("updateGlobals ");
                var gmBounds = mphmap.getBounds(),
                    mapLinkrBounds = {},
                    ne,
                    sw;
                if (gmBounds) {
                    ne = gmBounds.getNorthEast();
                    sw = gmBounds.getSouthWest();
                    // bounds = gmBounds;
                    mapLinkrBounds.llx = gmBounds.xmin = sw.lng();
                    mapLinkrBounds.lly = gmBounds.ymin = sw.lat();
                    mapLinkrBounds.urx = gmBounds.xmax = ne.lng();
                    mapLinkrBounds.ury = gmBounds.ymax = ne.lat();
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
                mlconfig.setBounds(mapLinkrBounds);
            }

            function showGlobals(cntxt) {
                console.log(cntxt + " Globals : lon " + cntrxG + " lat " + cntryG + " zoom " + zmG);
            }

            function collectScales(levels) {
                scale2Level = [];
                var sc2lv = scale2Level,
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

            function markerInfoPopup(pos, content, title, mrkr) {
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
                        map: mphmap,
                        title: title
                    }),

                    showSomething  () {
                        var
                            fixedLL,
                            referrerId,
                            referrerName,
                            pushLL;
                        fixedLL = utils.toFixed(marker.position.lng(), marker.position.lat(), 6);
                        referrerId = mlconfig.getUserId();
                        referrerName = PusherConfig.getUserName();
                        pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : zmG,
                            "referrerId" : referrerId, "referrerName" : referrerName,
                            'address' : marker.address, 'title' : marker.title };
                        console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
                        PusherSetupCtrl.publishClickEvent(pushLL);
                    };


                google.maps.event.addListener(marker, 'click', function () {
                    var btnShare;
                        // referrerId,
                        // usrId;
                    infowindow.setContent(contentString);
                    infowindow.open(mphmap, this);

                    btnShare = document.getElementById(shareBtnId);
                    // referrerId = mlconfig.getReferrerId();
                    // usrId = mlconfig.getUserId();
                    // if (referrerId && referrerId != usrId) {
                        // if (btnShare) {
                        //     console.debug(btnShare);
                        //     btnShare.style.visibility = 'hidden';
                        // }
                    // }
                    btnShare.onclick  () {
                        showSomething();
                    };
                });
                return { "infoWnd" : infowindow, "infoMarker" : marker};
            }

            function placeMarkers(places) {
                var boundsForMarkers,
                    image,
                    marker,
                    place,
                    i;
                for (i = 0; i < markers.length; i += 1) {
                    marker = markers[i];
                    if (marker) {
                        marker.setMap(null);
                    }
                }

                // For each place, get the icon, place name, and location.
                markers = [];
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
                            map: mphmap,
                            icon: image,
                            title: place.name,
                            address : place.formatted_address,
                            position: place.geometry.location
                        });

                        markers.push(marker);
                        markerInfoPopup(place.geometry.location, marker.address, marker.title, marker);

                        boundsForMarkers.extend(place.geometry.location);
                    }
                }
            }

            function placesQueryCallback(results, status) {
                console.log('status is ' + status);
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    if (results && results.length > 0) {
                        console.log('PlacesService returned ' + results.length);
                        placeMarkers(results);
                    } else {
                        console.log('placesService() returned no results');
                    }
                }
            }


            function addInitialSymbols() {
                var popPt = new google.maps.LatLng(41.890283, -87.625842),
                    hint = "Lofty Thoughts";
                markerInfoPopup(popPt, "Creativity is inspired by collapsing ceilings and rubble walls.", hint);
                popPt = new google.maps.LatLng(41.888941, -87.620692);
                hint = "Drafty Sweatbox";
                markerInfoPopup(popPt, "Climate control as nature intended.", hint);
                popPt = new google.maps.LatLng(41.884979, -87.620950);
                hint = "Blank Wall Vistas";
                markerInfoPopup(popPt, "Panorama views are over-rated if you prefer exposed brick.", hint);
                // this.polygon([
                    // [51.509, -0.08],
                    // [51.503, -0.06],
                    // [51.51, -0.047]
                // ]);
                // this.circle([51.508, -0.11], 500);
            }

            // function formatBounds(b) {
            //     var s = String.format("ll : {0}, {1}, ru : {2}, {3}",
            //                         b.getSouthWest().lng(), b.getSouthWest().lat(),
            //                         b.getNorthEast().lng(), b.getNorthEast().lat());
            //     return s;
            // }

            function extractBounds(action) {
                var zm = mphmap.getZoom(),
                    cntr = mphmap.getCenter(),
                    fixedLL = utils.toFixed(cntr.lng(), cntr.lat(), 6),
                    bnds = mphmap.getBounds(),
                    xtntDict = {
                        'src' : 'google',
                        'zoom' : zm,
                        'lon' : fixedLL.lon,
                        'lat' : fixedLL.lat,
                        'scale': scale2Level[zm].scale,
                        'action': action,
                        'bounds': bnds
                    };
                return xtntDict;
            }

            function compareExtents(msg, xtnt) {
                var cmp = true,
                    gmBounds = mphmap.getBounds(),
                    ne,
                    sw,
                    wdth,
                    hgt,
                    lonDif,
                    latDif;

                if (gmBounds) {
                    ne = gmBounds.getNorthEast();
                    sw = gmBounds.getSouthWest();
                    cmp = xtnt.zoom === zmG;
                    wdth = Math.abs(ne.lng() - sw.lng());
                    hgt = Math.abs(ne.lat() - sw.lat());
                    lonDif = Math.abs((xtnt.lon - cntrxG) / wdth);
                    latDif =  Math.abs((xtnt.lat - cntryG) / hgt);
                    // cmp = ((cmp == true) && (xtnt.lon == cntrxG) && (xtnt.lat == cntryG));
                    cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
                    console.log("compareExtents " + msg + " " + cmp);
                }
                return cmp;
            }

            function setBounds(action) {
                console.log("MapHosterGoogle setBounds with  " + pusherEvtHandler.getMapNumber());
                if (mapReady === true) {
                    // runs this code after you finishing the zoom
                    var xtExt = extractBounds(action),
                        xtntJsonStr = JSON.stringify(xtExt),
                        cmp,
                        service,
                        qtext,
                        gBnds,
                        triggered;
                    console.log("extracted bounds " + xtntJsonStr);
                    cmp = compareExtents("MapHosterGoogle " + mlconfig.getMapNumber() + " setBounds", xtExt);
                    if (cmp === false) {
                        console.log("MapHoster Google setBounds " + mlconfig.getMapNumber() + " pusher send to channel " + selfPusherDetails.channelName);
                        if (selfPusherDetails.pusher) {
                            triggered = selfPusherDetails.pusher.channel(selfPusherDetails.channelName).trigger('client-MapXtntEvent', xtExt);
                            console.log("triggered?");
                            console.log(triggered);
                        }
                        PusherSetupCtrl.publishPanEvent(xtExt);
                        updateGlobals("setBounds with cmp false", xtExt.lon, xtExt.lat, xtExt.zoom);

                        gBnds = mphmap.getBounds();
                        console.debug(gBnds);
                        // ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                        // ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                        // gBnds = new google.maps.LatLngBounds(ll, ur);
                        qtext = mlconfig.query();
                        if (qtext && qtext !== "") {
                            queryPlaces.bounds = gBnds;
                            queryPlaces.query = qtext;
                            queryPlaces.location = mphmap.getCenter();
                            service = new google.maps.places.PlacesService(mphmap);
                            service.textSearch(queryPlaces, placesQueryCallback);
                        }
                    }
                }
            }

            function hideLoading(error) {
                console.log("hide loading");
                utils.hideLoading(error);
            }

            function retrievedBoundsInternal(xj) {
                console.log("Back in MapHosterGoogle " + mlconfig.getMapNumber() + " retrievedBounds");
                if (xj.zoom === '0') {
                    xj.zoom = zmG;
                }
                var zm = xj.zoom,
                    tmpLon,
                    tmpLat,
                    tmpZm,
                    cntr,
                    gBnds,
                    qtext,
                    service,
                    cmp = compareExtents("retrievedBounds", {'zoom' : zm, 'lon' : xj.lon, 'lat' : xj.lat});
                    // view = xj.lon + ", " + xj.lat + " : " + zm + " " + scale2Level[zm].scale;
                    // document.getElementById("mppos").innerHTML = view;
                if (cmp === false) {
                    tmpLon = cntrxG;
                    tmpLat = cntryG;
                    tmpZm = zmG;

                    updateGlobals("retrievedBounds with cmp false", xj.lon, xj.lat, xj.zoom);
                    userZoom = false;
                    cntr = new google.maps.LatLng(xj.lat, xj.lon);
                    // userZoom = true;
                    if (xj.action === 'pan') {
                        if (tmpZm !== zm) {
                            mphmap.setZoom(zm);
                        }
                        mphmap.setCenter(cntr);

                        gBnds = mphmap.getBounds();
                        console.debug(gBnds);
                        // ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                        // ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                        // gBnds = new google.maps.LatLngBounds(ll, ur);
                        qtext = mlconfig.query();
                        if (qtext && qtext !== "") {
                            queryPlaces.bounds = gBnds;
                            queryPlaces.query = qtext;
                            queryPlaces.location = mphmap.getCenter();
                            service = new google.maps.places.PlacesService(mphmap);
                            service.textSearch(queryPlaces, placesQueryCallback);
                        }
                    } else {
                        if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                            mphmap.setCenter(cntr);
                        }
                        mphmap.setZoom(zm);
                    }
                    userZoom = true;
                }
            }

            function retrievedClick(clickPt) {
                var fixedLL = utils.toFixed(clickPt.x, clickPt.y, 6),
                    content,
                    popPt,
                    btnShare;
                console.log("Back in retrievedClick - with click at " +  clickPt.x + ", " + clickPt.y);
                // latlng = L.latLng(clickPt.y, clickPt.x, clickPt.y);
                // $inj = mlconfig.getInjector();
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
                if (popDetails !== null && clickPt.referrerId !== mlconfig.getUserId()) {
                    popDetails.infoWnd.close();
                    popDetails.infoMarker.setMap(null);
                }
                if (clickPt.referrerId !== mlconfig.getUserId()) {
                    popDetails = markerInfoPopup(popPt, content, "Received from user " + clickPt.referrerName + ", " + clickPt.referrerId);
                    popDetails.infoWnd.open(mphmap, popDetails.infoMarker);

                    btnShare = document.getElementsByClassName('sharebutton')[0];
                    if (btnShare) {
                        console.debug(btnShare);
                        btnShare.style.visibility = 'hidden';
                    }
                }
            }

            function configureMap(gMap, mapOptions, goooogle, googPlaces, config) {
                console.log("MapHosterGoogle configureMap");
                mlconfig = config;
                mphmap = gMap;
                google = goooogle;
                geoCoder = new google.maps.Geocoder();
                var
                    firstCntr,
                    qlat = 41.888996,
                    qlon = -87.623294,
                    qzoom = 15,
                    initZoom = mapOptions.zoom,
                    listener;

                if (mlconfig.testUrlArgs()) {
                    qlat = mlconfig.lat();
                    qlon = mlconfig.lon();
                    qzoom = mlconfig.zoom();
                    initZoom = parseInt(qzoom, 10);
                    updateGlobals("init with qlon, qlat", qlon, qlat, qzoom);
                } else {
                    if (mapOptions) {
                        updateGlobals("MapHosterGoogle init with passed in mapOptions", mapOptions.center.lng(), mapOptions.center.lat(), initZoom);
                    } else {
                        updateGlobals("MapHosterGoogle init with hard-coded values", qlon, qlat, initZoom);
                    }
                }
                firstCntr = new google.maps.LatLng(cntryG, cntrxG);
                mphmap.panTo(firstCntr);
                mphmap.setCenter(firstCntr);
                LocateSelfCtrl.setMap(goooogle, mphmap);

                // updateGlobals("init", -0.09, 51.50, 13, 0.0);
                showGlobals("MapHosterGoogle - Prior to new Map");
                // google.maps.event.addListener(mphmap, 'end', gotDragEnd);

                // Maybe it will work at this point!!!

                minZoom = maxZoom = zoomLevels = 0;

                maxZoom = 21;
                zoomLevels = maxZoom - minZoom;
                collectScales(zoomLevels);
                mlconfig.showConfigDetails('MapHosterGoogle - after collectScales');
                showGlobals("after collectScales");
                mphmap.setZoom(initZoom);
                /*

                google.maps.event.addListenerOnce(gMap, 'zoom_changed', function() {
                    var oldZoom = gMap.getZoom();
                    gMap.setZoom(oldZoom - 1); //Or whatever
                });
                */

                function placeCustomControls() {
                    var $inj = mlconfig.getInjector(),
                        ctrlSvc = $inj.get('MapControllerService'),
                        mapCtrl = ctrlSvc.getController();
                    setTimeout(function () {
                        mapCtrl.placeCustomControls();
                    }, 500);
                }

                function setupQueryListener() {
                    var $inj = mlconfig.getInjector(),
                        ctrlSvc = $inj.get('MapControllerService'),
                        mapCtrl = ctrlSvc.getController();
                    mapCtrl.setupQueryListener('google');
                }
                function fillMapWithMarkers() {
                    var $inj = mlconfig.getInjector(),
                        ctrlSvc = $inj.get('MapControllerService'),
                        mapCtrl = ctrlSvc.getController();
                    mapCtrl.fillMapWithMarkers();
                }

                google.maps.event.addListenerOnce(mphmap, 'tilesloaded', function () {
                    var zsvc = new google.maps.MaxZoomService(),
                        cntr = new google.maps.LatLng(cntryG, cntrxG), // {lat: cntryG, lng: cntrxG}, //
                        center,
                        gmQuery = mlconfig.query(),
                        bnds,
                        gBnds,
                        ll,
                        ur,
                        pacinput,
                        qtext,
                        service;
                    console.log(">>>>>>>>>>>>>> tiles loaded >>>>>>>>>>>>>>>>>>>>");

                    hideLoading();
                    mapReady = true;
                    center = mphmap.getCenter();
                    // google.maps.event.trigger(mphmap, 'resize');
                    // mphmap.setCenter(center);
                    addInitialSymbols();
                    // google.maps.event.trigger(mphmap, 'resize');
                    // mphmap.setCenter(center);
                    gmQuery = mlconfig.query();
                    console.log("getMaxZoomAtLatLng for " + cntr.lng() + ", " + cntr.lat());

                    zsvc.getMaxZoomAtLatLng(cntr, function (response) {
                        console.log("zsvc.getMaxZoomAtLatLng returned response:");
                        console.debug(response);
                        if (response && response.status === google.maps.MaxZoomStatus.OK) {
                            maxZoom = response.zoom;
                            zoomLevels = maxZoom - minZoom;
                            collectScales(zoomLevels);
                            // mlconfig.showConfigDetails('MapHosterGoogle zsvc.getMaxZoomAtLatLng - after collectScales');
                            showGlobals("after zsvc.getMaxZoomAtLatLng collectScales");
                        } else {
                            if (response) {
                                // alert("getMaxZoomAtLatLng service returned status other than OK");
                                console.log("getMaxZoomAtLatLng service returned status other than OK");
                                console.log(response.status);
                                console.log("zoom level returned " + response.zoom);
                                maxZoom = response.zoom || mphmap.getZoom();
                                console.log("used zoom level " + mphmap.getZoom());
                                zoomLevels = maxZoom - minZoom;
                                collectScales(zoomLevels);
                                showGlobals("after zsvc.getMaxZoomAtLatLng failure and collectScales");
                            } else {
                                alert("getMaxZoomAtLatLng service returned null");
                            }

                        }
                    });

                    console.log('gmQuery contains ' + gmQuery);
                // searchInput = (document.getElementById('pac-input' + mlconfig.getMapNumber()));
                // mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
                // searchInput.value = '';
                    if (gmQuery !== '') {
                        searchFiredFromUrl = true;
                        mlconfig.setQuery(gmQuery);
                    }
                    if (searchFiredFromUrl === true) {
                        console.log("getBoundsFromUrl.......in MapHosterGoogle 'places_changed' listener");
                        bnds = mlconfig.getBoundsFromUrl();
                        console.debug(bnds);
                        ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                        ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                        gBnds = new google.maps.LatLngBounds(ll, ur);
                        searchFiredFromUrl = false;

                        qtext = mlconfig.query();

                        pacinput = angular.element('pac-input' + mlconfig.getMapNumber());
                        pacinput.value = qtext;
                        // pacinput.focus();
                        queryPlaces.bounds = gBnds;
                        queryPlaces.query = qtext;
                        queryPlaces.location = center;
                        service = new google.maps.places.PlacesService(mphmap);
                        service.textSearch(queryPlaces, placesQueryCallback);
                    }

                    // setupQueryListener();
                    placeCustomControls();
                    fillMapWithMarkers();
                });

                setupQueryListener();
                // var bndsInit = createBounds();
                // mphmap.fitBounds(bndsInit);
                listener = google.maps.event.addListener(mphmap, "idle", function () {
                    console.log("Entering idle listener");
                    // var center = mphmap.getCenter();
                    var idleFirstCntr = new google.maps.LatLng(cntryG, cntrxG);
                    mphmap.setCenter(idleFirstCntr);
                    // mphmap.setZoom(12);
                    mphmap.setZoom(initZoom);
                    console.log("bounds in idle");
                    console.debug(mphmap.getBounds());
                    google.maps.event.removeListener(listener);
                });

                // searchInput = (document.getElementById('pac-input' + mlconfig.getMapNumber()));
                // mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
                // searchInput.value = '';
                // searchBox = new gplaces.SearchBox(/** @type {HTMLInputElement} */
                //     (searchInput));
                // searchBox = MapCtrl.getSearchBox();

                // Bias the SearchBox results towards places that are within the bounds of the
                // current map's viewport.
                google.maps.event.addListener(mphmap, 'bounds_changed', function () {
                    var changedBounds = mphmap.getBounds(),
                        convertedBounds;
                    // console.debug(changedBounds);
                    if (searchBox) {
                        searchBox.setBounds(changedBounds);
                    }
                    convertedBounds = {'llx' : changedBounds.getSouthWest().lng(), 'lly' : changedBounds.getSouthWest().lat(),
                                 'urx' : changedBounds.getNorthEast().lng(), 'ury' : changedBounds.getNorthEast().lat()};
                    mlconfig.setBounds(convertedBounds);
                });

                google.maps.event.addListener(mphmap, 'dragend', function () {
                    console.log("DRAG END");
                    if (userZoom === true) {
                        setBounds('pan');
                    }
                });
                google.maps.event.addListener(mphmap, "zoom_changed", function () {
                    if (userZoom === true) {
                        if (scale2Level.length > 0) {
                            setBounds('zoom', null);
                        }
                    // userZoom = true;
                    }
                });

                function gotResize() {
                    var center = mphmap.getCenter();
                    google.maps.event.trigger(mphmap, "resize");
                    mphmap.setCenter(center);
                    // console.log(mphmap.getBounds());
                }

                // google.maps.event.addListener(mphmap, 'resize', gotResize); //function() {
                    // console.log("resize event hit");
                    // console.log(mphmap.getBounds());
                // });

                google.maps.event.addDomListener(window, 'resize', function () {
                    gotResize();
                    // console.log("resize event hit");
                    // console.log(mphmap.getBounds());
                });

                google.maps.event.addListener(mphmap, "mousemove", function (e) {
                    var ltln = e.latLng,
                        fixedLL = utils.toFixed(ltln.lng(), ltln.lat(), 4),
                        evlng = fixedLL.lon,
                        evlat = fixedLL.lat,
                        zm = mphmap.getZoom(),
                        cntr = mphmap.getCenter(),
                        fixedCntrLL = utils.toFixed(cntr.lng(), cntr.lat(), 4),
                        cntrlng = fixedCntrLL.lon,
                        cntrlat = fixedCntrLL.lat;

                    if (scale2Level.length > 0) {
                        // var view = "Zoom : " + zm + " Scale : " + scale2Level[zm].scale + " Center : " + cntrlng + ", " + cntrlat + " Current : " + evlng + ", " + evlat;
                        // document.getElementById("mppos").value = view;
                        PositionViewCtrl.update('coords',
                            {
                                'zm' : zm,
                                'scl' : scale2Level[zm].scale,
                                'cntrlng' : cntrlng,
                                'cntrlat': cntrlat,
                                'evlng' : evlng,
                                'evlat' : evlat
                            });
                    }
                });

                function showClickResult(content, popPt, marker) {
                    if (popDetails !== null) {
                        popDetails.infoWnd.close();
                        popDetails.infoMarker.setMap(null);
                    }
                    popDetails = markerInfoPopup(popPt, content, "Ready to Push Click", marker);
                    // popDetails.infoWnd.open(mphmap, popDetails.infoMarker);
                    // if (selfPusherDetails.pusher)
                    // {
                        // var fixedLL = utils.toFixed(popPt.lng(), popPt.lat(), 6);
                        // var referrerId = mlconfig.getUserId();
                        // var referrerName = PusherConfig.getUserName();
                        // var pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : "0",
                            // "referrerId" : referrerId, "referrerName" : referrerName };
                        // console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
                        // selfPusherDetails.pusher.channel(selfPusherDetails.channelName).trigger('client-MapClickEvent', pushLL);
                    // }
                }



                function onMapClick(e) {
                    var popPt = e.latLng,
                        fixedLL = utils.toFixed(popPt.lng(), popPt.lat(), 6),
                        marker,
                        content = "You clicked the map at " + fixedLL.lat + ", " + fixedLL.lon;
                    geoCoder.geocode({'latLng': popPt}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                marker = new google.maps.Marker({
                                    map: mphmap,
                                    title: "",
                                    address : results[0].formatted_address,
                                    position: popPt
                                });

                                content = results[0].formatted_address;
                                showClickResult(content, popPt, marker);
                            } else {
                                showClickResult(content, popPt);
                            }
                        }
                    });
                    // showClickResult(content, popPt);
                }

                google.maps.event.addListener(mphmap, 'click', function (event) {
                    onMapClick(event);
                });

                pusherEvtHandler = new PusherEventHandler.PusherEventHandler(mlconfig.getMapNumber());
                console.log("Add pusher event handler for MapHosterGoogle " + mlconfig.getMapNumber());

                pusherEvtHandler.addEvent('client-MapXtntEvent', retrievedBoundsInternal);
                pusherEvtHandler.addEvent('client-MapClickEvent',  retrievedClick);
                /*
                function createBounds() {
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
            }
            /*
            function gotDragEnd() {
                console.log("dragend event hit");
                setBounds('pan');
            }
            */

            function getMapHosterName() {
                return "hostName is " + hostName;
            }

            function getMap() {
                return mphmap;
            }

            function getEventDictionary() {
                var eventDct = pusherEvtHandler.getEventDct();
                return eventDct;
            }
    /*
            function getBoundsZoomLevel(bounds) {
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
                latZoomLevel = Math.floor(Math.log(mphmap.height * 360 / latAngle / GLOBE_HEIGHT) / Math.LN2);
                lngZoomLevel = Math.floor(Math.log(mphmap.width * 360 / lngAngle / GLOBE_WIDTH) / Math.LN2);

                return (latZoomLevel < lngZoomLevel) ? latZoomLevel : lngZoomLevel;
            }
    */

            /*
            function polygon(coords) {
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

                pgn.setMap(mphmap);
            }

            function circle(cntr, rds) {
                var cntrLatLng = new google.maps.LatLng(cntr[0], cntr[1]),
                    crcl = new google.maps.Circle({
                        center: cntrLatLng,
                        radius: rds,
                        strokeColor: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5
                    });

                crcl.setMap(mphmap);
            }
            */


            function setUserName(name) {
                PusherConfig.setUserName(name);
            }

            function getGlobalsForUrl() {
                return "&lon=" + cntrxG + "&lat=" + cntryG + "&zoom=" + zmG;
            }

            function getCenter() {
                var pos = { 'lon' : cntrxG, 'lat' : cntryG, 'zoom' : zmG};
                console.log("return accurate center from getCenter()");
                console.debug(pos);
                return pos;
            }

            function formatCoords(pos) {
                var fixed = utils.toFixed(pos.lng, pos.lat, 5),
                    formatted  = '<div style="color: blue;">' + fixed.lon + ', ' + fixed.lat + '</div>';
                return formatted;
            }

            function geoLocate(pos) {
                var infoWindow = new google.maps.InfoWindow({map: mphmap});
                infoWindow.setPosition(pos);
                infoWindow.setContent(formatCoords(pos));
                mphmap.setCenter(pos);
                mphmap.setZoom(14);
                updateGlobals('geoLocate just happened', pos.lng, pos.lat, 15);
            }

            function publishPosition(pos) {
                var gmQuery,
                    pubBounds;
                if (selfPusherDetails.pusher) {
                    console.log("MapHosterGoogle.publishPosition");
                    console.log(pos);

                    gmQuery = mlconfig.query();
                    if (gmQuery !== '') {
                        console.log("adding gmQuery : " + gmQuery);
                        pos.gmquery = gmQuery;
                        pos.search += "&gmquery=" + gmQuery;
                        pubBounds = mlconfig.getBoundsForUrl();
                        pos.search += pubBounds;
                    }
                    console.log('After adding gmQuery');
                    console.debug(pos.search);

                    selfPusherDetails.pusher.channel(selfPusherDetails.channelName).trigger('client-NewMapPosition', pos);
                }

            }

            function retrievedBounds(xj) {
                return retrievedBoundsInternal(xj);
            }

            function getSearchBounds() {
                var bounds = mphmap.getBounds();
                // console.debug(bounds);
                return bounds;
            }

            function setSearchBox(sbox) {
                searchBox = sbox;
            }

            function setPlacesFromSearch(places) {
                placesFromSearch = places;
                console.log("in setPlacesFromSearch");
                console.log(placesFromSearch);
            }

            // function MapHosterGoogle() {
            //     mapReady = false;
            //     // bounds = null;
            //     userZoom = true;
            // }

            function removeEventListeners() {
                console.log("empty removeEventListeners block in MapHosterGoogle");
            }

            function getPusherEventHandler() {
                return pusherEvtHandler;
            }

            function getMLConfig() {
                return mlconfig;
            }

            return {
                config : configureMap,
                retrievedBounds: retrievedBounds,
                retrievedClick: retrievedClick,
                setUserName : setUserName,
                getGlobalsForUrl: getGlobalsForUrl,
                getCenter : getCenter,
                getEventDictionary : getEventDictionary,
                getPusherEventHandler: getPusherEventHandler,
                publishPosition : publishPosition,
                removeEventListeners : removeEventListeners,
                getMapHosterName : getMapHosterName,
                setPlacesFromSearch : setPlacesFromSearch,
                getSearchBounds : getSearchBounds,
                setSearchBox : setSearchBox,
                getMap : getMap,
                placeMarkers : placeMarkers,
                geoLocate : geoLocate,
                getMLConfig: getMLConfig
            };
        };

        return {
            MapHosterGoogle: MapHosterGoogle
        };
    });

}());
// }).call(this);
