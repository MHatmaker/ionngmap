import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { PusherClientService } from '../../services/pusherclient.service';
// import { SharemapProvider } from '../../providers/sharemap/sharemap';
// import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'infopopup',
  templateUrl: 'infopopup.html'
})
export class InfopopupComponent {

  itemContent: any;

  constructor(info : NavParams, public viewCtrl: ViewController, private pusherClientService : PusherClientService ) {
    console.log('Hello InfopopupComponent Component');
    // alert(info.get('address'));
    // this.itemContent = info.get('address');
    let pushLL = {
        "x" : info.get('x'),
        "y" : info.get('y'),
        "z" : info.get('z'),
        "referrerId" : info.get('referrerId'),
        "referrerName" : info.get('referrerName'),
        'address' : info.get('address')
    };
    this.itemContent = pushLL;
    // this.itemContent = this.sharemapInfo.getInfo();
  }

  publishInfo() {
    this.pusherClientService.publishClickEvent(this.itemContent);
    this.viewCtrl.dismiss();

  }
  cancel() {
    console.log("cancelled arcgis infopopup");
    this.viewCtrl.dismiss();
  }

}
