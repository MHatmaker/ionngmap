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
  async getCurrentLocation() {
    await this.canvasService.awaitCurrentLocation();
    let chnl = this.locateselfgroup.value.latitude;
    let uname = this.locateselfgroup.value.longitude;
    let cntr = this.canvasService.getInitialLocation().center;
    this.locateselfgroup.setValue({latitude : cntr.lat, longitude : cntr.lng});
    // setTimeout(
    //   this.viewCtrl.dismiss(),
    //   3000);
  }
  accept() {
    this.viewCtrl.dismiss();
  }
  logForm(){
    console.log(this.locateselfgroup.value)
  }

  cancel() {
      this.viewCtrl.dismiss();
  }

}
