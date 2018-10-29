
import { CommonToNG } from '../libs/CommonToNG';
import { GmpopoverProvider } from '../../../providers/gmpopover/gmpopover';
import { Popover } from 'ionic-angular';
import { GeoPusherSupport, IGeoPusher } from './geopushersupport';

declare var google;


export class MarkerInfoPopup {
    private infoWindow;
    private popOver : Popover;
    private geopushSup : IGeoPusher;

    constructor(private pos, private content : string, private title : string,
      private mrkr=null, private mphmap, private geopush ? : GeoPusherSupport) {
        this.geopushSup = geopush.getGeoPusherSupport();
        var shareBtnId = "idShare" + title,
            dockBtnId =  "idDock" + title,
            contentRaw = content,
            contentString = `<ion-card>
                <ion-item class="item item-block item-md bar bar-header bar-positive">
                  <ion-label style="color: steelblue"> ${title}</ion-label>
                  <button>
                    <ion-icon item-right>
                      <svg id="${dockBtnId}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                        class="svg-icon"><path d="M2 4v24h28V4H2zm22 22H4V6h20v20z"/></svg>
                    </ion-icon>
                  </button>
                </ion-item>
                <ion-item class="item item-block item-md calm" style="color: teal;">
                  ${content}
                </ion-item>
                <ion-item class="item item-block item-md">
                  <button ion-button="" class="item-button button button-md button-default button-default-md" color="btn-primary"
                    id="${shareBtnId}" style="visibility: block; width: 32px; height: 32px;
                      background-image: url('assets/imgs/share-info.png');">
                  <div class="button-effect"></div>
                  </button>
                </ion-item>
              </ion-card>`,


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

            addListeners = function(self, shrBtnId, dockBtnId) {
                  let btnShare = document.getElementById(shrBtnId);
                  // referrerId = this.mlconfig.getReferrerId();
                  // usrId = this.mlconfig.getUserId();
                  // if (referrerId && referrerId != usrId) {
                      // if (shrBtnId) {
                      //     console.debug(shrBtnId);
                      //     shrBtnId.style.visibility = 'hidden';
                      // }
                  // }
                  // shrBtnId.onclick = function () {
                  //     shareClick();
                  // };

                  btnShare.addEventListener('click', (e:Event) => shareClick(e, self));

                  let btnDock = document.getElementById(dockBtnId);
                  btnDock.addEventListener('click', (e:Event) => dockPopup(e, self));
            },

            dockPopup = function(e: Event, self) {
                console.log(e);
                console.log(e.srcElement.id);
                self.infoWindow.close();
                //self.infowindow.close();
                let gmpop = CommonToNG.getLibs().gmpopoverSvc;
                gmpop.dockPopEmitter.subscribe((retval : any) => {
                    console.log(`dockPopEmitter event received from ${retval.title} in popover for ${title} `);
                    if(retval) {
                        if(retval.action == 'undock') {
                            if(retval.title == title) {
                              console.log('titles matched....open infoWindow');
                              self.infoWindow.open(self.mphmap, marker);
                          } else {
                              console.log("titles didn't match....close infoWindow");
                              self.infoWindow.close();
                          }
                          console.log(`close popover for ${title}`);
                          gmpop.close();
                          console.log('dockPopEmitter client received and processed undock');
                        } else if(retval.action == 'close') {
                            console.log('dockPopEmitter client received close...close infoWindow and popover');
                            self.infoWindow.close();
                            gmpop.close();
                        }
                    } else {
                        // got click on map outside docked popover
                        console.log('dockPopEmitter client received map click....close infoWindow and popover');
                        gmpop.close();
                        self.infoWindow.close();
                    }
                    // gmpop.dockPopEmitter.unsubscribe();
                });
                console.log(`open popover for ${title}`);
                self.popOver = gmpop.open(contentRaw, title).pop;
            }

          this.infoWindow = new google.maps.InfoWindow({
              content: contentString
          });


        google.maps.event.addListener(marker, 'click',  async (event) => {
            this.infoWindow.setPosition(event.latLng);
            if( this.infoWindow.content.includes('undefined')) {
              let latlng = {lat: pos.lat(), lng: pos.lng()};
              this.geopushSup.geoCoder.geoCode({location : latlng}).then((adrs) => {
                contentRaw = adrs;
                let contentfixed = this.infoWindow.content.replace('undefined', adrs);
                google.maps.event.addListener(this.infoWindow, "domready", () =>{
                    addListeners(this, shareBtnId, dockBtnId);
                });
                this.infoWindow.setContent(contentfixed);
              });
            } else {
                google.maps.event.addListener(this.infoWindow, "domready", () =>{
                    addListeners(this, shareBtnId, dockBtnId);
                });
            }
            this.infoWindow.open(this.mphmap, marker);
        });

    }
    getPopover() : Popover {
        return this.popOver;
    }
    getInfoWindow() : google.maps.InfoWindow {
        return this.infoWindow;
    }
    getPopups() {
        let retvals = {'infoWindow' : google.maps.InfoWindow = this.infoWindow, 'popOver' : this.popOver};
        return retvals;
    }
}
