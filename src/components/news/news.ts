import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

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
