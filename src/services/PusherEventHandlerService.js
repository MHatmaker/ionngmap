/*global define, console*/
(function () {
    'use strict';
    define([
    ], function () {

        console.log("ready to create PusherEventHandlerService");
        function PusherEventHandler() {
            this.eventDct = {
                'client-MapXtntEvent' : null,
                'client-MapClickEvent' : null,
                'client-NewMapPosition' : null
            };
        }

        PusherEventHandler.prototype.getEventDct = function () {
            return this.eventDct;
        };

        PusherEventHandler.prototype.addEvent = function (evt, handler) {
            this.eventDct[evt] = handler;
        };

        PusherEventHandler.prototype.getEventDct = function (evt) {
            return this.eventDct[evt];
        };
    });

}());
