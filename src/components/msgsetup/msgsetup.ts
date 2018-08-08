import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrentMapTypeService } from '../../services/currentmaptypeservice';
import { MapInstanceService } from '../../services/MapInstanceService';

@Component({
  selector: 'msgsetup',
  templateUrl: 'msgsetup.html'
})
export class MsgsetupComponent {

  private msgsetupgroup : FormGroup;
  private urlCopyField : string;
  private instructionsVisible : boolean = false;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder,
    private currentMapTypeService : CurrentMapTypeService, private mapInstanceService : MapInstanceService
  ) {
    console.log('Hello MsgsetupComponent Component');

    this.msgsetupgroup = this.formBuilder.group({
      urlCopyField: ["url"],
    });
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
