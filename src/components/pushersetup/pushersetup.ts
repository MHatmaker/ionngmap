import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PusherConfig } from '../../pages/mlcomponents/libs/PusherConfig';
import { PusherClientService } from '../../services/pusherclient.service';

@Component({
  selector: 'pushersetup',
  templateUrl: 'pushersetup.html'
})
export class PushersetupComponent {

  // userName: string;
  // privateChannelMashover : string;
  private pushergroup : FormGroup;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder,
    private pusherClientService : PusherClientService, private pusherConfig: PusherConfig) {
    console.log('Hello PushersetupComponent Component');
    // this.privateChannelMashover = 'Hello World';
    this.pushergroup = this.formBuilder.group({
      privateChannelMashover: [pusherConfig.getPusherChannel()], //, Validators.required],
      userName: [pusherConfig.getUserName()],
    });
  }

  accept() {
      this.viewCtrl.dismiss();
      let chnl = this.pushergroup.value.privateChannelMashover;  //  ['privateChannelMashover'];
      this.pusherConfig.setChannel(chnl); //this.pushergroup.value['privateChannelMashover']);
  }
  logForm(){
    console.log(this.pushergroup.value)
  }
  cancel() {
      this.viewCtrl.dismiss();
  }
}
