import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Destination, DestinationsProvider } from '../../providers/destinations/destinations';

@Component({
  selector: 'destselection',
  templateUrl: 'destselection.html'
})
export class DestselectionComponent implements OnInit {
  public selectedDestination : Destination;
  public destinations : Array<Destination>=[];
  // public useDestination : string;
  @ViewChild('useDestination', { read: ElementRef }) useDestination : ElementRef;
  // destinations = [
  //   {title : "Same Window", description: "Replace the map in the current window"},
  //   {title : "New Tab", description: "Open the new map in a new tab/slide"},
  //   {title : " New Window", description: "Open the new map in a new window"}
  // ];

  constructor(public viewCtrl: ViewController, private destinationsProvider : DestinationsProvider ) {
    console.log('Hello DestselectionComponent Component');
    this.destinations = destinationsProvider.getDestinations();
    this.selectedDestination = destinationsProvider.previousDestination();
    // this.useDestination = 'Open new map in ' + this.selectedDestination.title;
  }

  ngOnInit() {
    this.useDestination.nativeElement.innerText = this.selectedDestination.title;
  }

  checkDestination(item) {
      // this.selectedDestination = item;
      // console.log(this.destselgroup);
      // this.destselgroup.value['destTitle'] = item.title;
      // item.isChecked = true;
      this.destinationsProvider.clearChecks(item);
      this.selectedDestination = item;
      // this.selectedDestination.isChecked = true;
      // this.useDestination = 'Open new map in ' + item.title;
      this.useDestination.nativeElement.innerText = this.selectedDestination.description;
      // this.useDestination.value = 'Open new map in ' + this.selectedDestination.title;
  }

  accept() {
      this.destinationsProvider.preserveDestination(this.selectedDestination);
      this.viewCtrl.dismiss({destination : this.selectedDestination});
      // this.viewCtrl.dismiss({destination : this.selectedDestination.title});
  }
  logForm(){
  }
  cancel() {
      this.viewCtrl.dismiss({destination : "cancel"});
  }
}
