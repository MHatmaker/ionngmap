import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the NewsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'news',
  templateUrl: 'news.html'
})
export class NewsComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
    console.log('Hello NewsComponent Component');
    this.text = 'Hello World';
  }
  showNews() {
      console.log("Yay!  show news");
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }

}
