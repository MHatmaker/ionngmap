
import { Injectable,Output, EventEmitter } from '@angular/core';
import { InfopopupComponent } from '../../components/infopopup/infopopup';
import { ModalController } from 'ionic-angular';

@Injectable()
export class SharemapProvider {

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  private info : any;

  constructor(private modalCtrl : ModalController) {
    console.log('Hello SharemapProvider Provider');
  }

  setInfo(nfo) {
    this.info = nfo;
  }

  shareInfo(nfo) {
    this.change.emit(nfo);
  }

  getInfo() {
    return this.info;
  }
  showInfo(nfo) {

    let modal = this.modalCtrl.create(InfopopupComponent, {'address' : nfo});
    modal.present();
  }

}
