import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CanvasService } from '../../services/CanvasService';

@Component({
  selector: 'locateself',
  templateUrl: 'locateself.html'
})
export class LocateselfComponent {

  constructor(public viewCtrl: ViewController,
        private geoLocation : Geolocation,
        private canvasService : CanvasService) {
    console.log('Hello LocateselfComponent Component');
  }
  getCurrentLocation() {
    this.canvasService.getCurrentLocation();
  }

  cancel() {
      this.viewCtrl.dismiss();
  }

}
