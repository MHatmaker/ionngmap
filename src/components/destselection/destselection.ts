import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'destselection',
  templateUrl: 'destselection.html'
})
export class DestselectionComponent {
  public selectedDestination : string = 'Same Window';
  public destselgroup : FormGroup;
  destinations = [
    {title : "Same Window", description: "Replace the map in the current window"},
    {title : "New Tab", description: "Open the new map in a new tab/slide"},
    {title : " New Window", description: "Open the new map in a new window"}
  ];

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder) {
    console.log('Hello DestselectionComponent Component');
    this.destselgroup = this.formBuilder.group({
      selectedDestination : this.selectedDestination,
      dests : this.destinations
    });
  }

  checkDestination(item) {
      this.selectedDestination = item.title;
      console.log(this.destselgroup);
      this.destselgroup.value['selectedDestination'] = item.title;
      console.log("checkDestination - item " + this.selectedDestination);
  }

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
