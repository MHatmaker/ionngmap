import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { GmpopoverComponent } from '../../components/gmpopover/gmpopover';
import { PopoverController, Popover } from 'ionic-angular';

export class PopRect {
  constructor(public left : string, public top : string, public bottom : string) {}
}

@Injectable()
export class GmpopoverProvider {

  private popOver : Popover = null;
  private title : string;
  private popovers = new Map<string, Popover>();
  public dockPopEmitter = new EventEmitter<{'action' : string, 'title' : string}>();
  constructor(public http: HttpClient, private popCtrl : PopoverController) {
    console.log('Hello GmpopoverProvider Provider');

  }
  open(content : string, title : string) : {pop : Popover, poprt : PopRect} {
    this.title = title;
    if(this.popOver) {
      this.popOver.dismiss();
      this.popOver = null;
    }
    this.popOver = this.popCtrl.create(GmpopoverComponent,
          {title : title, content : content}, {cssClass: 'custom-popover popover-custom popover-content', enableBackdropDismiss : true});

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
      this.popOver.present({ev});

      this.popOver.onDidDismiss((data : {action : string, title : string})=> {
          console.log('popover onDidDismiss');
          if(data) {
            data.title = this.title;
          } else {
            console.log('onDidDismiss with background click');
            data = {title : this.title, action : 'undock'};
          }
          console.log(data);
          if(this.popOver) {
              this.popOver = null;
          }
          this.dockPopEmitter.emit(data);
      });
      let rect = new PopRect('20', '100', 'unset');
      return {pop : this.popOver, poprt : rect};
  }

  closePopover (title : string) {
    this.popovers[title].close();
  }

  close() {
      if(this.popOver) {
        this.popOver.dismiss();
        this.popOver = null;
        // this.dockPopEmitter.emit({'action' : 'close', title : this.title});
      }
  }

}
