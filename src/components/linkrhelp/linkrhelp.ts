import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'linkrhelp',
  templateUrl: 'linkrhelp.html'
})
export class LinkrhelpComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
    console.log('Hello LinkrhelpComponent Component');
    this.text = 'Hello World';
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }
}
