
import { Injectable,Output, EventEmitter } from '@angular/core';

@Injectable()
export class SharemapProvider {

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  private info : any;

  constructor() {
    console.log('Hello SharemapProvider Provider');
  }

  setInfo(nfo) {
    this.info = nfo;
  }

  shareInfo() {
    this.change.emit(this.info);
  }


}
