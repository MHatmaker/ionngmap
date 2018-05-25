import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Destination, DestinationsProvider } from '../../providers/destinations/destinations';

@Component({
  selector: 'destselection',
  templateUrl: 'destselection.html'
})
export class DestselectionComponent {
  public selectedDestination : Destination;
  public destselgroup : FormGroup;
  public destinations : Destination[];
  public useDestination : string;
  // destinations = [
  //   {title : "Same Window", description: "Replace the map in the current window"},
  //   {title : "New Tab", description: "Open the new map in a new tab/slide"},
  //   {title : " New Window", description: "Open the new map in a new window"}
  // ];

  constructor(public viewCtrl: ViewController, public formBuilder : FormBuilder, private destinationsProvider : DestinationsProvider ) {
    console.log('Hello DestselectionComponent Component');
    this.destinations = destinationsProvider.getDestinations();
    this.selectedDestination = destinationsProvider.previousDestination();
    this.destselgroup = formBuilder.group({
      selectedDestination : this.selectedDestination,
      dests : this.destinations,
      useDestination : this.selectedDestination.title
    });
    // this.destselgroup.setValue({selectedDestination : this.selectedDestination, useDestination : this.selectedDestination.title, dests: this.destinations})
    this.destselgroup.controls['dests'].setValue(this.selectedDestination);
    // this.destselgroup.value = {title:  "Same Window", description : "never mind";}
  }

  checkDestination(item) {
      // this.selectedDestination = item;
      // console.log(this.destselgroup);
      // this.destselgroup.value['destTitle'] = item.title;
      item.isChecked = true;
      this.destselgroup.value['selectedDestination'] = item;
      this.destselgroup.patchValue({useDestination : item.title});
      this.destselgroup.patchValue({dests : item});
      this.destselgroup.patchValue({selectedDestination : item});
      // console.log("checkDestination - item " + this.selectedDestination);
      this.destselgroup.controls['dests'].setValue(item);
      console.log(this.destselgroup.value);
  }

  accept() {
      this.destinationsProvider.preserveDestination(this.destselgroup.value['selectedDestination'])
      this.viewCtrl.dismiss({destination : this.destselgroup.value['selectedDestination']});
      // this.viewCtrl.dismiss({destination : this.selectedDestination.title});
  }
  logForm(){
    console.log(this.destselgroup.value)
  }
  cancel() {
      this.viewCtrl.dismiss({destination : "cancel"});
  }
}
