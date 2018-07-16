import { Component } from '@angular/core';

@Component({
  selector: 'sharemap',
  templateUrl: 'sharemap.html'
})
export class SharemapComponent {

  text: string;

  constructor() {
    console.log('Hello SharemapComponent Component');
    this.text = 'Share the item with other maps';
  }

}
