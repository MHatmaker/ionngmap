import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'pushersetup',
  templateUrl: 'pushersetup.html'
})
export class PushersetupComponent {

  // userName: string;
  // privateChannelMashover : string;
  private pushergroup : FormGroup;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder) {
    console.log('Hello PushersetupComponent Component');
    // this.privateChannelMashover = 'Hello World';
    this.pushergroup = this.formBuilder.group({
      privateChannelMashover: [''], //, Validators.required],
      userName: [''],
    });
  }

  accept() {
      this.viewCtrl.dismiss();
  }
  logForm(){
    console.log(this.pushergroup.value)
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }
}
