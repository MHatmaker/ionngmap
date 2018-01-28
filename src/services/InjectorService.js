/*global define, console, angular*/
/*jslint es5: true*/

define(
    [
    ],
    function () {
        'use strict';
        var
            app = angular.module('mapModule');

        console.log("ready to create InjectorService");

        app.factory("InjectorSvc", function () {
            var injector = angular.injector(['mapModule']),
                getInjector = function () {
                    return injector;
                };
            return {
                getInjector : getInjector
            };
        });
    }
);
