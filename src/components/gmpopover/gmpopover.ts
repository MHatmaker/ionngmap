import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'gmpopover',
  templateUrl: 'gmpopover.html'
})
export class GmpopoverComponent {
  idDock : string;
  shareBtnId : string;
  content : string;
  title : string;

  constructor(public viewCtrl : ViewController, public navParams:NavParams) {
    console.log('Hello GmpopoverComponent Component');
    this.title = navParams.get('title');
    this.content = navParams.get('content');
    this.shareBtnId = "idShare" + this.title;
    this.idDock =  "idDock" + this.title;
  }

  shareClick(evt : Event) {
    this.viewCtrl.dismiss({"action" : "share"});
  }
  dockPopup(evt: Event) {
    this.viewCtrl.dismiss({"action" : "dock"});
  }
}
