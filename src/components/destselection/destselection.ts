import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'destselection',
  templateUrl: 'destselection.html'
})
export class DestselectionComponent {

  private destselgroup : FormGroup;
  shownGroup = null;
  destinations = [
    {title : "Same Window"},
    {title : "New Tab"},
    {title : " New Window"}
  ];

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder) {
    console.log('Hello DestselectionComponent Component');
    this.destselgroup = this.formBuilder.group({
      selectedDestination : "Same Window"
    });
  }

    toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    };
    isGroupShown(group) {
        return this.shownGroup === group;
    };

  accept() {
      this.viewCtrl.dismiss();
  }
  logForm(){
    console.log(this.destselgroup.value)
  }
  cancel() {
      this.viewCtrl.dismiss();
  }
}
