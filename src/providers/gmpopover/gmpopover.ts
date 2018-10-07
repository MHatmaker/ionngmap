import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { GmpopoverComponent } from '../../components/gmpopover/gmpopover';
import { PopoverController, Popover } from 'ionic-angular';

@Injectable()
export class GmpopoverProvider {

  private popOver : Popover;
  public dockPopEmitter = new EventEmitter<boolean>();
  constructor(public http: HttpClient, private popCtrl : PopoverController) {
    console.log('Hello GmpopoverProvider Provider');

  }
  open(content : string, title : string) {
     let popover = this.popCtrl.create(GmpopoverComponent,
        {title : title, content : content}, {cssClass: 'custom-popover popover-custom popover-content', enableBackdropDismiss : false});
        this.popOver = popover;
     let ev = {
        target : {
          getBoundingClientRect : () => {
            return {
              top: '100',
              left: '20'
            };
          }
        }
      };
      popover.present({ev});
      popover.onDidDismiss(data => {
          console.log('popover onDidDismiss');
          console.log(data);
          if(this.popOver) {
              this.popOver = null;
          }
          this.dockPopEmitter.emit(false);
      });
  }

  close() {
      if(this.popOver) {
        this.popOver.dismiss();
        this.popOver = null;
        this.dockPopEmitter.emit(false);
      }
  }

}
