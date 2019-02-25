import { Component, Input, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { CommonToNG } from '../../pages/mlcomponents/libs/CommonToNG';

@Component({
  selector: 'markeranimator',
  templateUrl: 'markeranimator.html',
  animations: [
    trigger('changeState', [
      state('normal', style({
        backgroundColor: 'green',
        transform: 'scale(0.5)'
      })),
      state('animated', style({
        backgroundColor: 'blue',
        transform: 'scale(1.5)'
      })),
      transition('*=>normal', animate('1800ms')),
      transition('*=>animated', animate('2200ms'))
    ])
  ]
})
export class MarkeranimatorComponent {
  @Input() currentState = "normal";

  constructor() {
    console.log('Hello MarkeranimatorComponent Component');
    let infopop = CommonToNG.getLibs().infopopSvc;
    let subscriber = infopop.dockPopEmitter.subscribe((retval : any) => {
      console.log("MarkeranimatorComponent got undock event");
      this.currentState = 'animated';
    });
  }

}
