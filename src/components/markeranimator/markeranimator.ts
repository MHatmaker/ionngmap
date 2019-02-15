import { Component, Input, trigger, state, style, transition, animate, keyframes } from '@angular/core';

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
  @Input() currentState;

  constructor() {
    console.log('Hello MarkeranimatorComponent Component');
  }

}
