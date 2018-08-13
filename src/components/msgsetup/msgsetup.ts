import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CurrentMapTypeService } from '../../services/currentmaptypeservice';
import { MapInstanceService } from '../../services/MapInstanceService';
import { GeoPusherSupport } from '../../pages/mlcomponents/libs/geopushersupport';
import * as Clipboard from 'clipboard/dist/clipboard.min.js';

@Component({
  selector: 'msgsetup',
  templateUrl: 'msgsetup.html'
})
export class MsgsetupComponent {

  private urlCopyField : string;
  private instructionsVisible : boolean = false;
  private mapInstanceService : MapInstanceService;
  private currentMapTypeService : CurrentMapTypeService;

  constructor(public viewCtrl: ViewController, private geopush : GeoPusherSupport) {
    console.log('Hello MsgsetupComponent Component');

    let geoPush = geopush.getGeoPusherSupport();
    this.mapInstanceService = geoPush.mapInstanceService;
    this.currentMapTypeService = geoPush.currentMapTypeService;
  }
  assembleUrl() {
      console.log("gethref : ");
      let mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig();
      console.log(mlConfig.gethref());
      let updtUrl = mlConfig.gethref(),
          curmapsys = this.currentMapTypeService.getMapRestUrl(),
          gmQuery = encodeURIComponent(mlConfig.getQuery()),
          bnds = mlConfig.getBoundsForUrl();

      if (updtUrl.indexOf('?') < 0) {
          updtUrl +=  mlConfig.getUpdatedRawUrl();
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

  // copyToClipboard(text) {
  //   if (window.clipboardData && window.clipboardData.setData) {
  //       // IE specific code path to prevent textarea being shown while dialog is visible.
  //       return clipboardData.setData("Text", text);
  //       Window.cl
  //     }
  // }
  copyUrlField(inputElement){
      inputElement.select();
      document.execCommand('copy');
      inputElement.setSelectionRange(0, 0);
    }

  fetchUrl() {
    this.urlCopyField = this.assembleUrl();

    console.log(this.urlCopyField);
    this.instructionsVisible = true;
    // let clipboard = new Clipboard('#cpyBtn', {container: document.getElementById('idMsgSetupCard')});
    // clipboard.text = this.urlCopyField;
    // clipboard.on('success', (e) => {
    //   e.clipboardData = this.urlCopyField;
    //   console.log("copied to clipboard");
    //   console.info('clipboardData', e.clipboardData);
    //   console.info('Action:', e.action);
    //   console.info('Text:', e.text);
    //   console.info('Trigger:', e.trigger);
    // });
    // clipboard.on('error', (e) => {
    //   console.error('Action:', e.action);
    //   console.error('Trigger:', e.trigger);
    // });
  }

  logForm(){
    console.log(this.urlCopyField);
  }
  close() {
      this.viewCtrl.dismiss();
  }

}