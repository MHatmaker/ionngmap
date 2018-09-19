import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CurrentMapTypeService } from '../../services/currentmaptypeservice';
import { MapInstanceService } from '../../services/MapInstanceService';
import { HostConfig } from '../../pages/mlcomponents/libs/HostConfig';
import { PusherConfig } from '../../pages/mlcomponents/libs/PusherConfig';
import { GeoPusherSupport } from '../../pages/mlcomponents/libs/geopushersupport';
import * as Clipboard from 'clipboard/dist/clipboard.min.js';
import { PusherClientService } from '../../services/pusherclient.service';
import { MapLocOptions, MapLocCoords, IMapShare } from '../../services/positionupdate.interface';
import { EmailerProvider, EmailParts, IEmailAddress } from '../../providers/emailer/emailer';
import { EMapSource } from '../../services/configparams.service'
import { ImlBounds } from "../../services/mlbounds.service";
import { IPosition } from '../../services/position.service';

@Component({
  selector: 'msgsetup',
  templateUrl: 'msgsetup.html'
})
export class MsgsetupComponent {

  private urlCopyField : string;
  private recipientAdrs : string;
  private items: any = [];
  private selectedItem : any = null;
  private mapInstanceService : MapInstanceService;
  private currentMapTypeService : CurrentMapTypeService;

  constructor(public viewCtrl: ViewController, private geopush : GeoPusherSupport, private hostConfig : HostConfig,
      private pusherConfig : PusherConfig, private emailer : EmailerProvider) {
    console.log('Hello MsgsetupComponent Component');

    let geoPush = geopush.getGeoPusherSupport();
    this.mapInstanceService = geoPush.mapInstanceService;
    this.currentMapTypeService = geoPush.currentMapTypeService;

    this.items = [
        {expanded: false},
        {expanded: false},
        {expanded: false}
    ];
    this.selectedItem = this.items[0];
  }
  assembleUrl() {
      console.log("gethref : ");
      let mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig();
      console.log(this.hostConfig.gethref());
      let updtUrl = this.hostConfig.gethref(),
          curmapsys = this.currentMapTypeService.getMapRestUrl(),
          gmQuery = encodeURIComponent(mlConfig.getQuery()),
          bnds = mlConfig.getBoundsForUrl(),
          channel = this.pusherConfig.masherChannel(false);

      if (updtUrl.indexOf('?') < 0) {
          updtUrl +=  mlConfig.getUpdatedRawUrl(channel);
      }
      console.log("Raw Updated url");
      console.log(updtUrl);
      updtUrl += '&maphost=' + curmapsys;
      updtUrl += '&referrerId=-99';


      if (gmQuery !== '') {
          updtUrl += "&gmquery=" + gmQuery;
          updtUrl += bnds;
      }

      return updtUrl;
  }

  assembleJson() : IMapShare {
    let mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig(),
        curmapsys : string = this.currentMapTypeService.getMapRestUrl(),
        gmQuery : string = mlConfig.getQuery(),
        bnds : ImlBounds = mlConfig.getBounds(),
        curpos : IPosition = mlConfig.getPosition(),
        cntr = {lat : curpos.lat, lng : curpos.lon},
        zoom : number = curpos.zoom,
        pos : MapLocOptions = {center : cntr, zoom : zoom, query : gmQuery, places : null},
        username  : string = this.hostConfig.getUserName(),
        // switch from getting places as the source for another tab to sharing the source and query for another user
        src = mlConfig.getSource() == EMapSource.placesgoogle ? EMapSource.sharegoogle : mlConfig.getSource(),
        ago : string = src == EMapSource.sharegoogle ? 'nowebmap' : mlConfig.getWebmapId(false),
        opts : IMapShare = {mapLocOpts : pos, userName : username, mlBounds : bnds, source : src, webmapId : ago};

        return opts;

  }

  // copyToClipboard(text) {
  //   if (window.clipboardData && window.clipboardData.setData) {
  //       // IE specific code path to prevent textarea being shown while dialog is visible.
  //       return clipboardData.setData("Text", text);
  //       Window.cl
  //     }
  // }
  copyUrlField(inputElement){
      // inputElement.select();
      // document.execCommand('copy');
      // inputElement.setSelecti  onRange(0, 0);

    // let clipboard = new Clipboard('#cpyBtn', {container: document.getElementById('cpyBtn')});
    let clipboard = new Clipboard('#cpyBtn', {
        text: () => {
            return this.urlCopyField;
        }
    });

    clipboard.on('success', (e) => {
      // e.clipboardData = this.urlCopyField;
      console.log("copied to clipboard");
      console.info('clipboardData', e.clipboardData);
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);
    });
    clipboard.on('error', (e) => {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  }
  expandItem(item){

      this.items.map((listItem) => {

          if(item == listItem){
              listItem.expanded = !listItem.expanded;
              // this.selectedItem.expanded = listItem.expanded;
          } else {
              listItem.expanded = false;
          }

          return listItem;

      });

  }
  fetchUrl() {
    let mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig();

    this.urlCopyField = this.assembleUrl();

    console.log(this.urlCopyField);
    this.selectedItem = this.items[0];
    this.expandItem(this.items[0]);
  }

  setupMapLinkrMail() {
    this.selectedItem = this.items[1];
    this.expandItem(this.items[1]);
  }
  setupDirectShare() {
    this.selectedItem = this.items[2];
    this.expandItem(this.items[2]);
  }

  sendMail() {
    let mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig();

    this.urlCopyField = this.assembleUrl();

    console.log(this.urlCopyField);
    let adrs : IEmailAddress = {Email : this.recipientAdrs}; //{Email : 'michael.hatmaker@gmail.com'}
    let email = new EmailParts({ to : [adrs], subject : mlConfig.getQuery(), text : this.urlCopyField});
    this.emailer.sendEmail(email);

  }

  logForm(){
    console.log(this.urlCopyField);
  }
  close() {
    this.viewCtrl.dismiss('usemsg', null);
  }
  shareMap() {
    // let pusherClientService = this.geopush.getGeoPusherSupport().pusherClientService;
    // pusherClientService.publishPosition(this.urlCopyField);
    this.viewCtrl.dismiss('usepush', JSON.stringify(this.assembleJson()));
  }

}
