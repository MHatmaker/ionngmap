import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'destselection',
  templateUrl: 'destselection.html'
})
export class DestselectionComponent {
  public selectedDestination : any;
  public destselgroup : FormGroup;
  destinations = [
    {title : "Same Window", description: "Replace the map in the current window"},
    {title : "New Tab", description: "Open the new map in a new tab/slide"},
    {title : " New Window", description: "Open the new map in a new window"}
  ];

  constructor(public viewCtrl: ViewController, public formBuilder : FormBuilder) {
    console.log('Hello DestselectionComponent Component');
    this.destselgroup = formBuilder.group({
      selectedDestination : this.selectedDestination,
      dests : this.destinations,
      destTitle : "Same Window"
    });
    // this.destselgroup.value = {title:  "Same Window", description : "never mind";}
  }

  checkDestination(item) {
      this.selectedDestination = item;
      console.log(this.destselgroup);
      this.destselgroup.value['destTitle'] = item.title;
      this.destselgroup.value['selectedDestination'] = item.title;
      this.destselgroup.patchValue({selectedDestination : item.title});
      console.log("checkDestination - item " + this.selectedDestination);
      console.log(this.destselgroup.value);
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
