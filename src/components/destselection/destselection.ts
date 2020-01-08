import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Destination, DestinationsProvider } from '../../providers/destinations/destinations';

@Component({
  selector: 'destselection',
  templateUrl: 'destselection.html'
})
export class DestselectionComponent implements OnInit {
  public selectedDestination : Destination;
  public destinations : Array<Destination>=[];
  public useDestination : string;
  // @ViewChild('useDestination', { read: ElementRef }) useDestination : ElementRef;

  constructor(public viewCtrl: ViewController, private destinationsProvider : DestinationsProvider,
    private zone:NgZone) {
    console.log('Hello DestselectionComponent Component');
    this.destinations = destinationsProvider.getDestinations();
    this.selectedDestination = destinationsProvider.previousDestination();
  }

  ngOnInit() {
    // this.useDestination.nativeElement.innerText = this.selectedDestination.title;
    this.useDestination = this.selectedDestination.title;
    // this.destinationsProvider.clearChecks(this.selectedDestination);
  }

  checkDestination(item) {
      this.selectedDestination = item;
      // this.useDestination.nativeElement.innerText = this.selectedDestination.description;
      this.zone.run(() => {
          // this.destinationsProvider.clearChecks(item);
          this.useDestination = this.selectedDestination.description;
      });
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
