/*global require, define, console, document, angular*/

(function () {
    'use strict';

    console.log("MapControllerService setup");
    define([
        'controllers/MapCtrl'
    ], function (MapCtrl) {
        function initService() {
            var
                app = angular.module('mapModule');

            console.log("ready to create MapControllerService");
            app.factory('MapControllerService', function () {
                var getController = function () {
                    return MapCtrl;
                };
                return {getController : getController};
            });
        }
        return {
            startService: initService
        };
    });
}());
