import { Component } from '@angular/core';

@Component({
  selector: 'sharemap',
  templateUrl: 'sharemap.html'
})
export class SharemapComponent {

  text: string;

  constructor() {
    this.text = 'Share with other maps';
  }

  showInfo() {
    alert("showInfo");
  }

}
