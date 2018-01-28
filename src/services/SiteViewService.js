/*global require, define, console, document, angular*/

(function () {
    'use strict';

    console.log("SiteViewService setup");
    define([
    ], function () {
        function initService() {
            var
                app = angular.module('mapModule');

            app.factory("SiteViewService", function () {
                var ExpandSite = "Max Map",
                    Symbol = "Expand";
                return {
                    setSiteExpansion : function (tf) {
                        ExpandSite = tf ? "Max Map" : "Min Map";
                        Symbol = tf ? "Expand" : "Collapse";
                    },
                    getSiteExpansion : function () {
                        return ExpandSite;
                    },
                    getMinMaxSymbol : function () {
                        return Symbol;
                    }
                };
            });
        }
        return {
            startService: initService
        };
    });

}());
