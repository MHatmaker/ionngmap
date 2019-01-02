
import { CommonToNG } from '../libs/CommonToNG';
import { InfopopProvider } from '../../../providers/infopop/infopop';
import { Popover } from 'ionic-angular';
import { GeoPusherSupport, IGeoPusher } from './geopushersupport';
// import { PophandlerProvider } from '../../../providers/pophandler/pophandler';
import { InfopopComponent } from '../../../components/infopop/infopop';

declare var google;


export class MarkerInfoPopup {
    public popOver : string;
    private geopushSup : IGeoPusher;
    private popContent : string;
    private popTitle : string;
    private popId : string;
    private popMarker : google.maps.Marker;

    constructor(private pos, private content : string, public title : string,
      private mrkr=null, private mphmap, private userId : string, private mapNumber : number, private geopush ? : GeoPusherSupport,
      private isShared : boolean = false) {
        this.geopushSup = geopush.getGeoPusherSupport();
            this.popTitle = title;
            this.popContent = content;
        var self = this,
            contentRaw = content,
            marker = mrkr || new google.maps.Marker({
                position: pos,
                map: this.mphmap,
                title: title
            }),
            // shareClick  = function(e: Event, self) {
            //     let fixedLL = self.geopushSup.utils.toFixedTwo(marker.position.lng(), marker.position.lat(), 9);
            //     let referrerId = self.mlconfig.getUserId();
            //     let referrerName = self.geopushSup.pusherConfig.getUserName();
            //     let mapId = "map" + self.mlconfig.getUserId();
            //     let pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : self.zmG,
            //         "referrerId" : referrerId, "referrerName" : referrerName,
            //         "mapId" : mapId,
            //         'address' : marker.address, 'title' : marker.title };
            //     console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
            //     self.geopushSup.pusherClientService.publishClickEvent(pushLL);
            // },

            dockPopup = async function(e: Event, self) {
                // console.log(e);
                // console.log(e.srcElement.id);
                let infopop = CommonToNG.getLibs().infopopSvc;
                let subscriber = infopop.dockPopEmitter.subscribe((retval : any) => {
                    console.log(`dockPopEmitter event received from ${retval.title} in popover for ${title} userId ${self.userId}`);
                    if(retval) {
                        console.log(`retval.action is ${retval.action}`);
                        if(retval.action == 'undock') {
                          if(retval.title == title) {
                              console.log('titles matched....');
                          } else {
                              console.log("titles didn't match....unsubscribe");
                              subscriber.unsubscribe();
                          }
                          console.log(`close popover for ${title}`);
                          // infopop.close();
                          console.log('dockPopEmitter client received and processed undock');
                        } else if(retval.action == 'close') {
                            console.log('dockPopEmitter client received close...close popover');
                            subscriber.unsubscribe();
                            infopop.close(self.popOver);
                        } else if(retval.action == 'share') {
                          self.shareClick(e, self, retval.title);
                        }
                    } else {
                        // got click on map outside docked popover
                        console.log('dockPopEmitter client received map click....close popover and unsubscribe');
                        infopop.close(self.popOver);
                        subscriber.unsubscribe();
                    }
                    // self.geopushSup.pophandlerProvider.closePopupsExceptOne(title);
                    subscriber.unsubscribe();
                });
                console.log(`open popover for ${self.userId} with title ${title}`);
                self.popOver = await infopop.create(marker, self.mapNumber, InfopopComponent, contentRaw, title);
            }

        if(! this.mrkr) {
            this.mrkr = marker;
        }
        this.popMarker = marker;
        google.maps.event.addListener(marker, 'click',  async (event) => {
            // this.geopushSup.pophandlerProvider.closePopupsExceptOne(marker.title);
            console.log(`triggered click listener for user ${this.userId} on marker ${marker.title}`);
            let latlng = {lat: pos.lat(), lng: pos.lng()};
            this.geopushSup.geoCoder.geoCode({location : latlng}).then((adrs) => {
              contentRaw = adrs;
                dockPopup(event, this);
            });
            // this.geopushSup.pophandlerProvider.closeAllPopups();
        });

    }

    shareClick(e: Event, self, popoverId) {
        let marker = self.mrkr,
            fixedLL = self.geopushSup.utils.toFixedTwo(marker.position.lng(), marker.position.lat(), 9),
            referrerName = self.geopushSup.pusherConfig.getUserName(),
            referrerId = this.userId,
            mapId = "map" + this.userId,
            pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : self.zmG,
              "referrerId" : referrerId, "referrerName" : referrerName,
              "mapId" : mapId, "popId" : popoverId,
              'address' : marker.address, 'title' : marker.title };
        console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
        self.geopushSup.pusherClientService.publishClickEvent(pushLL);
    }

    openSharedPopover() {
      console.log(`openPopover on share for ${this.userId}, with title ${this.popTitle}, content ${this.popContent}`);
      console.log('isShared ?');
      console.log(this.isShared);
      if (this.isShared === true) {
        google.maps.event.trigger(this.popMarker, 'click');
      }
      // let infopop = CommonToNG.getLibs().infopopoverSvc;
      // infopop.open(this.popContent, this.popTitle);
    }

    closePopover(ngUid) {
      let infopop = CommonToNG.getLibs().infopopSvc;
      infopop.close(ngUid);
    }
}
