/*global require, define, console, document, angular*/


(function () {
    'use strict';

    console.log("MapControllerService setup");
    define([
    ], function () {
        function initService() {
            var googleQueryDct = {},
                app = angular.module('mapModule');

            app.factory("GoogleQueryService", function ($rootScope) {

                googleQueryDct.rootScope = $rootScope;
                var getRootScope = function () {
                    return googleQueryDct.rootScope;
                },
                    getQueryDestinationDialogScope = function () {
                        var elemID = 'DestWndDialogNode',
                            e = document.getElementById(elemID),
                            scope = angular.element(e).scope();
                        return scope;
                    },

                    getPusherDialogScope = function () {
                        var elemID = 'PusherChannelDialog',
                            e = document.getElementById(elemID),
                            scope = angular.element(e).scope();
                        return scope;
                    },

                    setDialogVisibility = function (tf) {
                        var e = document.getElementById('Verbage'),
                            scope = angular.element(e).scope(),
                            previousVisibility = scope.VerbVis;
                        scope.VerbVis = tf ? 'flex' : 'none';
                        if (tf === false) {
                            angular.element(e).css({'display' : 'none'});
                        }
                        return previousVisibility;
                    },

                    getQueryDct = function () {
                        return googleQueryDct;
                    },
                    setQuery = function (q) {
                        // alert('setQuery' + q);
                        googleQueryDct.query = q;
                    };
                return {
                    getQueryDct: getQueryDct,
                    setQuery : setQuery,
                    getQueryDestinationDialogScope : getQueryDestinationDialogScope,
                    getPusherDialogScope : getPusherDialogScope,
                    setDialogVisibility : setDialogVisibility,
                    getRootScope : getRootScope
                };
            });
        }
        return {
            startService: initService
        };
    });
}());
