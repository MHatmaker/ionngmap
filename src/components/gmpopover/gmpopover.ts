import { Component, AfterContentInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'gmpopover',
  templateUrl: 'gmpopover.html'
})
export class GmpopoverComponent implements AfterContentInit {
  dockBtnId : string;
  shareBtnId : string;
  content : string;
  title : string;
  minimized : boolean = false;

  constructor(public viewCtrl : ViewController, public navParams:NavParams) {
    console.log(`Hello GmpopoverComponent Component for ${navParams.get('title')}`);
    this.title = navParams.get('title');
    this.content = navParams.get('content');
    this.shareBtnId = "idShare" + this.title;
    this.dockBtnId =  "dockBtnId" + this.title;
  }

  ngAfterContentInit() {
    let popconE = document.getElementsByClassName('popover-content')[0];
    let popconH = popconE as HTMLElement;
    // popconH.style.left = '10px';
  }

  shareClick(evt : Event) {
    this.viewCtrl.dismiss({"action" : "share"});
  }
  dockPopup(evt: Event) {
    console.log(`got dockPopup event from ${this.title}`);
    // this.viewCtrl.dismiss({"action" : "undock"});
    this.minimized = ! this.minimized;
  }
  closePopup(evt: Event) {
    this.viewCtrl.dismiss({"action" : "close"});
  }
}
