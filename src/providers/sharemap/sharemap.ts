
import { Injectable,Output, EventEmitter } from '@angular/core';
import { InfopopupComponent } from '../../components/infopopup/infopopup';
import { PusherClientService } from '../../services/pusherclient.service';
import { ModalController } from 'ionic-angular';

@Injectable()
export class SharemapProvider {

  // @Output() change: EventEmitter<boolean> = new EventEmitter();
  private info : any;
  private useStoredInfo : boolean = false;

  constructor(private modalCtrl : ModalController, private pusherClientService : PusherClientService) {
    console.log('Hello SharemapProvider Provider');
    this.useStoredInfo = false;
  }

  setInfo(nfo) {
    this.useStoredInfo = true;
    this.info = nfo;
  }

  shareInfo(nfo) {
    if (this.useStoredInfo) {
      this.useStoredInfo = false;
      // this.change.emit(this.info);
      this.pusherClientService.publishClickEvent(this.info);
    } else {
      // this.change.emit(nfo);
      this.pusherClientService.publishClickEvent(nfo);
    }
  }

  getInfo() {
    return this.info;
  }
  showInfo(nfo) {

    let modal = this.modalCtrl.create(InfopopupComponent, nfo);
    modal.present();
  }

}
