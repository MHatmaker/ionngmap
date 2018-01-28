/*global angular, console, define, document, HostConfig, require, alert */
/*jslint unparam: true*/

var
    instanceDetails = {'isInstantiated' : false},
    returnDetails = {};
(function () {
    "use strict";
    console.log("amd HostConfig");
    console.debug(instanceDetails);
    define(['libs/PusherConfig'], function (PusherConfig) {
        console.log("entering HostConfig");
        console.debug(instanceDetails);
        function init() {
            console.log("HostConfig ctor");
            console.debug(instanceDetails);
            var
                details = {
                    webmapId : "a4bb8a91ecfb4131aa544eddfbc2f1d0",
                    lat : '',
                    lon : '',
                    zoom : '',
                    nginj : null,
                    masherChannel : "private-channel-mashchannel",
                    masherChannelInitialized : false,
                    nameChannelAccepted : false,
                    protocol : 'http',
                    host : '', //"http://localhost",
                    hostport : '3035',
                    href : '', //"http://localhost",
                    userName: 'defaultuser',
                    search: {},
                    referrerId: ''
                },
                getParameterByName = function (name, details) {
                    // console.log("get paramater " + name + " from " + details.search);
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(details.search);
                    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                },
                masherChannel = function (newWindow) {
                    // alert(getParameterByName('channel'));
                    // alert(details.masherChannel);
                    return newWindow ? getParameterByName('channel', details) : details.masherChannel;
                },
                getChannelFromUrl = function () {
                    details.masherChannel = getParameterByName('channel', details);
                    details.masherChannelInitialized = true;
                    return details.masherChannel;
                },
                setChannel = function (chnl) {
                    if (details.masherChannelInitialized === false) {
                        details.masherChannelInitialized = true;
                    }
                    details.masherChannel = chnl;
                },
                isChannelInitialized = function () {
                    return details.masherChannelInitialized;
                },

                setNameChannelAccepted = function (tf) {
                    if (details.nameChannelAccepted === false) {
                        details.nameChannelAccepted = true;
                    }
                    details.nameChannelAccepted = tf;
                },
                isNameChannelAccepted = function () {
                    return details.nameChannelAccepted;
                },
                getWebmapId = function (newWindow) {
                    var result = "";
                    if (newWindow === true) {
                        result = getParameterByName('id', details);
                        if (result === "") {
                            result = details.webmapId;
                        }
                    } else {
                        result = details.webmapId;
                    }
                    return result;
                },
                setLocationPath = function (locPath) {
                    details.locationPath = locPath;
                },
                getLocationPath = function () {
                    return details.locationPath;
                },
                setSearch = function (searchDetails) {
                    details.search = searchDetails;
                },
                setprotocol = function (p) {
                    details.protocol = p;
                    console.log("protocol : " + details.protocol);
                },
                getprotocol = function () {
                    return details.protocol;
                },
                sethostport = function (hp) {
                    details.hostport = hp;
                    console.log("hostport : " + details.hostport);
                },
                gethostport = function () {
                    return details.hostport;
                },
                sethref = function (hrf) {
                    console.log("sethref : " + hrf);
                    details.href = hrf;
                    console.log("details href : " + details.href);
                },
                gethref = function () {
                    var pos = details.href.indexOf("/arcgis");
                    if (pos  > -1) {
                        return details.href; //.substring(0, pos);
                    }
                    return details.href;
                },
                setWebmapId = function (id) {
                    console.log("Setting webmapId to " + id);
                    details.webmapId = id;
                },
                getUserName = function () {
                    return details.userName;
                },
                getUserNameFromUrl = function () {
                    details.userName = getParameterByName('userName', details);
                    return details.userName;
                },
                setUserName = function (name) {
                    details.userName = name;
                },
                getUserId = function () {
                    return details.userId;
                },
                setUserId = function (id) {
                    details.userId = id;
                },
                getReferrerId = function () {
                    return details.referrerId;
                },
                getReferrerIdFromUrl = function () {
                    details.referrerId = getParameterByName('referrerId');
                    return details.referrerId;
                },
                setReferrerId = function (id) {
                    details.referrerId = id;
                },
                getReferrerNameFromUrl = function () {
                    details.referrerName = getParameterByName('referrerName');
                    return details.referrerName;
                },
                getUserNameFromServer = function ($http, opts) {
                    console.log(PusherConfig.getPusherPath());
                    var pusherPath = PusherConfig.getPusherPath() + '/username';
                    console.log("pusherPath in getUserNameFromServer");
                    console.log(pusherPath);
                    $http(
                        {
                            method: 'GET',
                            url: pusherPath,
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            }
                        }).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available.
                            console.log('ControllerStarter getUserName: ', data.name);
                            if (opts.uname) {
                                PusherConfig.setUserName(data.name);
                            }
                            // alert('got user name ' + data.name);
                            if (opts.uid) {
                                PusherConfig.setUserId(data.id);
                            }
                            if (opts.refId === -99) {
                                PusherConfig.setReferrerId(data.id);
                            }
                        }).
                        error(function (data, status, headers, config) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            console.log('Oops and error', data);
                            alert('Oops' + data.name);
                        });
                },

                testUrlArgs = function () {
                    var rslt = getParameterByName('id', details);
                    // alert("getParameterByName('id') = " + rslt);
                    // alert(rslt.length);
                    // alert(rslt.length != 0);

                    console.log("getParameterByName('id') = " + rslt);
                    console.log(rslt.length);
                    console.log(rslt.length !== 0);
                    return rslt.length !== 0;
                },

                setUrl = function (u) {
                    details.url = u;
                },
                getUrl = function () {
                    return details.url;
                },
                sethost = function (h) {
                    details.host = h;
                    console.log("host : " + details.host);
                },
                gethost = function () {
                    return details.host;
                },
                setInitialUserStatus = function (tf) {
                    details.isInitialUser = tf;
                },
                getInitialUserStatus = function () {
                    return details.isInitialUser;
                },
                hasCoordinates = function () {
                    var result = "";
                    result = getParameterByName('zoom', details);
                    return result === "" ? false : true;
                },
                lon = function () {
                    return getParameterByName('lon', details);
                },
                lat = function () {
                    return getParameterByName('lat', details);
                },
                zoom = function () {
                    return getParameterByName('zoom', details);
                },
                setPosition = function (position) {
                    details.lon = position.lon;
                    details.lat = position.lat;
                    details.zoom = position.zoom;
                },
                getPosition = function () {
                    return {"webmapId" : details.webmapId, "mapType" : details.mapType, "lon" : details.lon, "lat" : details.lat, "zoom" : details.zoom};
                },

                setQuery = function (q) {
                    details.query = q;
                },
                query = function () {
                    return getParameterByName('gmquery', details);
                },
                getQueryFromUrl = function () {
                    // details.query.push(getParameterByName('gmquery'));
                    return details.query;
                },
                getbaseurl = function () {
                    var baseurl = details.host + "/"; // details.protocol + "//" + details.host + "/";
                    console.log("getbaseurl --> " + baseurl);
                    return baseurl;
                },
                showConfigDetails = function (msg) {
                    console.log(msg);
                    console.log(
                        'isInitialUser ' + details.isInitialUser + "\n",
                        "  userId : "  + details.userId + ', userName ' + details.userName + "\n" +
                            "referrerId : "  + details.referrerId + "\n" +
                            "locationPath : "  + details.locationPath + "\n" +
                            "host : "  + details.host + "\n" +
                            "hostport : "  + details.hostport + "\n" +
                            "href : "  + details.href + "\n"  +
                            "search : "  + details.search + "\n" +
                            "maphost : "  + details.maphost + "\n" +
                            "webmapId : "  + details.webmapId + "\n" +
                            "masherChannel : "  + PusherConfig.masherChannel(false) + "\n" +
                            "lon :" + details.lon + '\n' +
                            "lat : " + details.lat + "\n" +
                            "zoom : " + details.zoom
                    );
                };
            returnDetails = {
                getUserId: getUserId,
                setUserId: setUserId,
                getReferrerId: getReferrerId,
                getReferrerIdFromUrl: getReferrerIdFromUrl,
                getReferrerNameFromUrl: getReferrerNameFromUrl,
                setReferrerId: setReferrerId,
                setUserName: setUserName,
                getUserName: getUserName,
                getWebmapId: getWebmapId,
                setWebmapId: setWebmapId,
                masherChannel: masherChannel,
                getChannelFromUrl: getChannelFromUrl,
                isChannelInitialized: isChannelInitialized,
                isNameChannelAccepted: isNameChannelAccepted,
                setChannel: setChannel,
                setNameChannelAccepted: setNameChannelAccepted,
                getUserNameFromUrl: getUserNameFromUrl,
                getUserNameFromServer: getUserNameFromServer,
                testUrlArgs: testUrlArgs,
                sethost: sethost,
                gethost: gethost,
                showConfigDetails: showConfigDetails,
                query: query,
                setQuery: setQuery,
                getQueryFromUrl: getQueryFromUrl,
                lat: lat,
                lon: lon,
                zoom: zoom,
                hasCoordinates : hasCoordinates,
                setUrl: setUrl,
                getUrl: getUrl,
                setPosition: setPosition,
                getPosition: getPosition,
                setLocationPath: setLocationPath,
                getLocationPath: getLocationPath,
                setprotocol: setprotocol,
                getprotocol: getprotocol,
                setSearch: setSearch,
                sethostport: sethostport,
                gethostport: gethostport,
                sethref: sethref,
                gethref: gethref,
                setInitialUserStatus: setInitialUserStatus,
                getInitialUserStatus: getInitialUserStatus,
                getbaseurl: getbaseurl
            };
            instanceDetails.isInstantiated = true;
        }

        return {
            getInstance : function () {
                if (instanceDetails.isInstantiated) {
                    return returnDetails;
                } else {
                    console.log("isInstantiated is false, so init()");
                    init();
                    instanceDetails.isInstantiated = true;
                    return returnDetails;
                }
            }
        };
    });
}());
