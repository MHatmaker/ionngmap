import { Component, Input, trigger, state, style, transition, animate, keyframes, OnInit, AfterViewInit } from '@angular/core';
import { CommonToNG } from '../../pages/mlcomponents/libs/CommonToNG';
import { MarkeranimatorProvider } from '../../providers/markeranimator/markeranimator';

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
export class MarkeranimatorComponent implements OnInit {
  @Input() currentState = "normal";
  x : number = 99;
  y : number = 99;

  constructor() {
    console.log('Hello MarkeranimatorComponent Component');
    let infopop = CommonToNG.getLibs().infopopSvc;
    // let subscriber = infopop.dockPopEmitter.subscribe((retval : any) => {
    //   console.log("MarkeranimatorComponent got undock event");
    //   this.x = retval.x;
    //   this.y = retval.y;
    //   this.currentState = 'animated';
    //   this.currentState = 'normal';
    // });
  }
  ngOnInit() {

  }
  // ngAfterViewInit() {
  //   let xy : { x : number, y : number } = this.markeranimatorProvider.getCoordinates();
  //
  // }

}
