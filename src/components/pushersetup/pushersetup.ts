import { Component, ElementRef, Input } from '@angular/core';
import { IPusherConfig, IPusherConfigParams, PusherConfig } from '../../pages/mlcomponents/libs/PusherConfig';
import { MapInstanceService } from '../../services/MapInstanceService'
import { PusherClientService, PusherClient } from '../../services/pusherclient.service';
import {MLConfig } from '../../pages/mlcomponents/libs/MLConfig'


@Component({
    selector: 'pushersetup',
    templateUrl: 'pushersetup.html'
})
export class PushersetupComponent {
    private data : IPusherConfigParams;
    private userName : string = '';
    private channel : string = '';
    private mph : null;
    private pusher : null;
    private callbackFunction : null;
    private info : null;
    private isInitialized : false;
    private PusherClient : null;
    private isInstantiated : false;
    private serverUrl : string = 'https://maplinkr-simpleserver.herokuapp.com/';
    private clients : {};
    private eventHandlers : {};
    private displayPusherDialog : null;
    private element : any;
    private CHANNELNAME : string;
    private mapNumber : number;

    constructor(private pusherConfig : PusherConfig, private mapInstanceService : MapInstanceService,
        private pusherClientService : PusherClientService, private el: ElementRef, private mlconfig : MLConfig) {
        console.log('Hello PushersetupComponent Component');
        this.data.privateChannelMashover = this.pusherConfig.masherChannel(false),
        this.data.prevChannel = 'mashchannel',
        this.data.userName = this.userName,
        this.data.prevUserName = this.userName,
        this.data.whichDismiss = "Cancel"
        this.element = el.nativeElement;
    }
    // open modal
   open(): void {
       this.element.show();
       this.element.addClass('modal-open');
   }

   // close modal
   accept(): void {
       this.element.hide();
       this.element.removeClass('modal-open');
       this.pusherClientService.onAcceptChannel();
   }
   cancel(): void {
       this.element.hide();
       this.element.removeClass('modal-open');
       this.pusherClientService.cancel();
   }
    getPusherDetails() {
        return new Promise(function (resolve, reject) {
            $scope.displayPusherDialog = function () {
                console.log("displayPusherDialog");
                var tmplt = ' \
                  <div class="modal-dialog", style="width: 100%;"> \
                    <div class="modal-content"> \
                      <div class="modal-header"> \
                          <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button> \
                          <h4>Sharing Setup</h4> \
                      </div> \
                      <div class="modal-body"> \
                        <h4>Create a Pusher Channel ID :</h4> \
                        <input type="text" name="input" ng-model="data.privateChannelMashover" ng-init="data.privateChannelMashover" style="width: 100%"> \
                        <div>channel name : {{data.privateChannelMashover}}</div> \
                        <h4>Enter a User Name :</h4> \
                        <input type="text" name="input" ng-model="data.userName", ng-init="data.userName" style="width: 100%"> \
                        <div style="color: #17244D; margin-top: 10px;">USER NAME : {{data.userName}}</div> \
                      <div class="modal-footer"> \
                        <button type="button" class="btn btn-primary" ng-click="accept()">Accept</button> \
                        <button type="button" class="btn btn-secondary" ng-click="cancel()">Cancel</button> \
                      </div> \
                    </div><!-- /.modal-content --> \
                  </div><!-- /.modal-dialog --> \
                ',
                    modalInstance = $uibModal.open({
                        template : tmplt,
                        controller : 'PusherCtrl',
                        size : 'sm',
                        backdrop : 'false',
  //                        appendTo : hostElement,
                        resolve : {
                            data: function () {
                                return $scope.data;
                            }
                        }
                    });

                return modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    this.scope.data.userName = selectedItem.userName;
                    this.scope.data.privateChannelMashover = selectedItem.privateChannelMashover;
                    this.scope.onAcceptChannel();
                    resolve('after onAcceptChannel');
                }, function () {
                    console.log('Pusher Modal dismissed at: ' + new Date());
                    reject('pusher modal error');
                });

            };
            $scope.displayPusherDialog();
        });
    }

    setupPusherClient  (resolve, reject) {
        var promise;
        this.userName = this.pusherConfig.getUserName();
        promise = this.getPusherDetails();

        return promise.then(function (response) {
            console.log('getPusherDetails resolve response ' + response);
            resolve(response);
            return promise;
        }, function (error) {
            console.log('getPusherDetails error response ' + error);
            return error;
        });
        return promise;
    };

    getPusherChannel() {
        var promise = new Promise(function (resolve, reject) {
            var result = this.setupPusherClient(resolve, reject);
            console.log('getPusherChannel returns ' + result);
        });
        return promise;
    }
    createPusherClient(mlcfg, cbfn, nfo) {
        console.log("PusherSetupCtrl.createPusherClient");
        this.mlconfig = mlcfg;
        var
            mapHoster = this.mlconfig.getMapHosterInstance(),
            clientName = 'map' + this.mlconfig.getMapNumber();

        this.CHANNELNAME = this.pusherConfig.getPusherChannel();
        this.userName = this.pusherConfig.getUserName();
        this.mapNumber = this.mlconfig.getMapNumber();
        this.userName = this.pusherConfig.getUserName();
        this.callbackFunction = cbfn;
        this.info = nfo;
        console.log("createPusherClient for map " + clientName);
        this.clients[clientName] = new PusherClient(mapHoster.getEventDictionary(), clientName);

        return this.clients[clientName];
    }
}
