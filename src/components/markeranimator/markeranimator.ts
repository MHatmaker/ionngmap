import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'markeranimator',
  templateUrl: 'markeranimator.html',
  animations: [
    trigger('changeState', [
      state('normal', style({
        backgroundColor: 'green',
        transform: 'scale(1)'
      })),
      state('animated', style({
        backgroundColor: 'blue',
        transform: 'scale(1.5)'
      })),
      transition('*=>normal', animate('800ms')),
      transition('*=>animated', animate('200ms'))
    ])
  ]
})
export class MarkeranimatorComponent {

  text: string;

  constructor() {
    console.log('Hello MarkeranimatorComponent Component');
    this.text = 'Hello World';
  }

}
