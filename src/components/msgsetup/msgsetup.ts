import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrentMapTypeService } from '../../services/currentmaptypeservice';
import { MapInstanceService } from '../../services/MapInstanceService';
import { GeoPusherSupport } from '../../pages/mlcomponents/libs/geopushersupport'

@Component({
  selector: 'msgsetup',
  templateUrl: 'msgsetup.html'
})
export class MsgsetupComponent {

  private msgsetupgroup : FormGroup;
  private urlCopyField : string;
  private instructionsVisible : boolean = false;
  private mapInstanceService : MapInstanceService;
  private currentMapTypeService : CurrentMapTypeService;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder, private geopush : GeoPusherSupport) {
    console.log('Hello MsgsetupComponent Component');

    this.msgsetupgroup = this.formBuilder.group({
      urlCopyField: ["url"],
    });
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
  fetchUrl() {
    this.urlCopyField = this.assembleUrl();
    console.log(this.urlCopyField);
    this.instructionsVisible = true;
  }

  logForm(){
    console.log(this.msgsetupgroup.value.urlCopyField);
  }
  close() {
      this.viewCtrl.dismiss();
  }

}
