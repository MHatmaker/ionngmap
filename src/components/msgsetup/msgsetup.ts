import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'msgsetup',
  templateUrl: 'msgsetup.html'
})
export class MsgsetupComponent {

  private msgsetupgroup : FormGroup;
  private urlCopyField : string;
  private instructionsVisible : boolean = false;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder) {
    console.log('Hello MsgsetupComponent Component');

    this.msgsetupgroup = this.formBuilder.group({
      urlCopyField: ["url"],
    });
  }

  fetchUrl() {
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
