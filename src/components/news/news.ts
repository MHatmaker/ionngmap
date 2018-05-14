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

  constructor(public viewCtrl: ViewController) {
    console.log('Hello NewsComponent Component');
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }

}
