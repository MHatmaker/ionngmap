import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { CanvasService } from '../../services/CanvasService';

@Component({
  selector: 'locateself',
  templateUrl: 'locateself.html'
})
export class LocateselfComponent {
  private locateselfgroup : FormGroup;
  private latitude : number;
  private longitude : number;
  constructor(public viewCtrl: ViewController,
        private geoLocation : Geolocation,
        private canvasService : CanvasService,
        private formBuilder : FormBuilder) {
    console.log('Hello LocateselfComponent Component');
    this.locateselfgroup = this.formBuilder.group({
      latitude : ["initial latitude"], //, Validators.required],
      longitude : ["initial longitude"],
    });
  }
  getCurrentLocation() {
    this.canvasService.awaitCurrentLocation();
    let chnl = this.locateselfgroup.value.latitude;
    let uname = this.locateselfgroup.value.longitude;
    this.viewCtrl.dismiss();
  }
  logForm(){
    console.log(this.locateselfgroup.value)
  }

  cancel() {
      this.viewCtrl.dismiss();
  }

}
