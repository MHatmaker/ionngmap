
import { CommonToNG } from '../libs/CommonToNG';
import { GmpopoverProvider } from '../../../providers/gmpopover/gmpopover';
import { Popover } from 'ionic-angular';
import { GeoPusherSupport, IGeoPusher } from './geopushersupport';
// import { PophandlerProvider } from '../../../providers/pophandler/pophandler';

declare var google;


export class MarkerInfoPopup {
    public popOver : Popover;
    private geopushSup : IGeoPusher;

    constructor(private pos, private content : string, public title : string,
      private mrkr=null, private mphmap, private geopush ? : GeoPusherSupport) {
        this.geopushSup = geopush.getGeoPusherSupport();
        var shareBtnId = "idShare" + title,
            dockBtnId =  "idDock" + title,
            contentRaw = content,

            marker = mrkr || new google.maps.Marker({
                position: pos,
                map: this.mphmap,
                title: title
            }),
            shareClick  = function(e: Event, self) {
                let fixedLL = self.geopushSup.utils.toFixedTwo(marker.position.lng(), marker.position.lat(), 9);
                let referrerId = self.mlconfig.getUserId();
                let referrerName = self.geopushSup.pusherConfig.getUserName();
                let mapId = "map" + self.mlconfig.getUserId();
                let pushLL = {"x" : fixedLL.lon, "y" : fixedLL.lat, "z" : self.zmG,
                    "referrerId" : referrerId, "referrerName" : referrerName,
                    "mapId" : mapId,
                    'address' : marker.address, 'title' : marker.title };
                console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLL.lat + ", " + fixedLL.lon);
                self.geopushSup.pusherClientService.publishClickEvent(pushLL);
            },

            dockPopup = function(e: Event, self) {
                // console.log(e);
                // console.log(e.srcElement.id);
                let gmpop = CommonToNG.getLibs().gmpopoverSvc;
                let subscriber = gmpop.dockPopEmitter.subscribe((retval : any) => {
                    console.log(`dockPopEmitter event received from ${retval.title} in popover for ${title} `);
                    if(retval) {
                        if(retval.action == 'undock') {
                          if(retval.title == title) {
                              console.log('titles matched....');
                          } else {
                              console.log("titles didn't match....unsubscribe");
                              subscriber.unsubscribe();
                          }
                          console.log(`close popover for ${title}`);
                          gmpop.close();
                          console.log('dockPopEmitter client received and processed undock');
                        } else if(retval.action == 'close') {
                            console.log('dockPopEmitter client received close...close popover');
                            subscriber.unsubscribe();
                            gmpop.close();
                        }
                    } else {
                        // got click on map outside docked popover
                        console.log('dockPopEmitter client received map click....close popover and unsubscribe');
                        gmpop.close();
                        subscriber.unsubscribe();
                    }
                    // self.geopushSup.pophandlerProvider.closePopupsExceptOne(title);
                    subscriber.unsubscribe();
                });
                console.log(`open popover for ${title}`);
                self.popOver = gmpop.open(contentRaw, title).pop;
                // self.geopushSup.pophandlerProvider.closePopupsExceptOne(title);
            }

        google.maps.event.addListener(marker, 'click',  async (event) => {
            // this.geopushSup.pophandlerProvider.closePopupsExceptOne(marker.title);
            let latlng = {lat: pos.lat(), lng: pos.lng()};
            this.geopushSup.geoCoder.geoCode({location : latlng}).then((adrs) => {
              contentRaw = adrs;
              dockPopup(event, this);
            });
            // this.geopushSup.pophandlerProvider.closeAllPopups();
        });

    }
    closePopover(title) {
      let gmpop = CommonToNG.getLibs().gmpopoverSvc;
      gmpop.closePopover(title);
    }
    getPopover() : Popover {
        return this.popOver;
    }
}
