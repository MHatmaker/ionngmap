import { EventEmitter, Output, OnDestroy } from '@angular/core';
import { Broadcaster } from './broadcaster.service';

export class BroadcastBase {
  private counter : number;

  @Output() countUpdate = new EventEmitter<any>();

  constructor(private broadcaster: Broadcaster) {
    this.counter = 0;

    this.broadcaster.on('globalCountUpdate')
      .subscribe(message => {
        this.counter++;
    });
  }

  onUpdate(event) {
    this.counter = event.value;
  }

  onClick() {
    this.countUpdate.emit({
      value: ++this.counter
    });
  }
}
