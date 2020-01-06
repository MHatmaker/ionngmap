import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class Destination {
    // title : string;
    // description : string;
    // isChecked : boolean;
    // id : number
    public color : string = "secondary";
    constructor ( public title : string, public description : string, public isChecked : boolean, public id: number)
    {}
}

@Injectable()
export class DestinationsProvider {

  private isFirstUse : boolean = true;
  private destinations : Array<Destination> = [
    {title : "Same Window", description: "Replace the map in the current window", isChecked : true, id : 0, color : "primary"},
    {title : "New Tab", description: "Open the new map in a new tab/slide", isChecked : false, id : 1, color : "secondary"},
    {title : " New Window", description: "Open the new map in a new window", isChecked : false, id : 2, color : "secondary"}
  ];
  private currentDestination : Destination; // = new Destination(
            // "SameWindow", "Replace the map in the current window",  false, 0);

  constructor() {
    if (this.isFirstUse) {
      this.currentDestination = this.destinations[0]; //new Destination("SameWindow", "Replace the map in the current window",  false, 0);
      this.isFirstUse = false;
    } else {
      this.currentDestination = new Destination(this.currentDestination.title, this.currentDestination.description,
          this.currentDestination.isChecked, this.currentDestination.id);
    }
  }
  getDestinations() : Destination[] {
      return this.destinations;
  }
  preserveDestination(dest : Destination) {
      this.currentDestination = dest;
      console.log("preserveDestination");
      console.log(dest);
      for (let i in this.destinations) {
         if(this.destinations[i].id == dest.id){
            this.destinations[i].isChecked = true;
            this.destinations[i].color = "primary";
          } else {
            this.destinations[i].isChecked = false;
            this.destinations[i].color = "secondary";
          }
      }
  }
  clearChecks(dest : Destination) {
      for (let i in this.destinations) {
          if(this.destinations[i].id = dest.id) {
            this.destinations[i].isChecked = true;
          } else {
            this.destinations[i].isChecked = false;
          }
      }
  }
  previousDestination() : Destination {
      return this.currentDestination;
  }

}
