import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { GmpopoverComponent } from '../../components/gmpopover/gmpopover';
import { PopoverController, Popover } from 'ionic-angular';

@Injectable()
export class GmpopoverProvider {

  private popOver : Popover;
  private title : string;
  public dockPopEmitter = new EventEmitter<{'action' : string, 'title' : string}>();
  constructor(public http: HttpClient, private popCtrl : PopoverController) {
    console.log('Hello GmpopoverProvider Provider');

  }
  open(content : string, title : string) {
    this.title = title;
    let popover = this.popCtrl.create(GmpopoverComponent,
        {title : title, content : content}, {cssClass: 'custom-popover popover-custom popover-content', enableBackdropDismiss : true});
        this.popOver = popover;
     let ev = {
        target : {
          getBoundingClientRect : () => {
            return {
              top: '100',
              left: '20',
              bottom: 'unset'
            };
          }
        }
      };
      popover.present({ev});
      popover.onDidDismiss((data : {action : string, title : string})=> {
          console.log('popover onDidDismiss');
          if(data) {
            data.title = this.title;
          } else {
            data = {title : this.title, action : 'undock'};
          }
          console.log(data);
          if(this.popOver) {
              this.popOver = null;
          }
          this.dockPopEmitter.emit(data);
      });
  }

  close() {
      if(this.popOver) {
        this.popOver.dismiss();
        this.popOver = null;
        this.dockPopEmitter.emit({'action' : 'close', title : this.title});
      }
  }

}
