import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'sharinghelp',
  templateUrl: 'sharinghelp.html'
})
export class SharinghelpComponent {

  constructor(public viewCtrl : ViewController) {
    console.log('Hello SharinghelpComponent Component');
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }
}
