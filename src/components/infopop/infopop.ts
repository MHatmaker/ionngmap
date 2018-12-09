
import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { InfopopProvider } from '../../providers/infopop/infopop';

@Component({
  selector: 'infopop',
  templateUrl: 'infopop.html'
})
export class InfopopComponent {

    private popoverId: string;
    private element : Element;
    private parentElem : Element;
    private minimized : boolean = false;
    private title : string;
    private content : string;

    constructor(private infopopProvider: InfopopProvider, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        let modal = this;
        this.popoverId = uuid();

        // ensure id attribute exists
        if (!this.popoverId) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else

        // this.parentElem = document.getElementById(this.popoverId);
        // this.parentElem.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click',  (e: any) => {
            var target = e.target;
            // if (!target.closest('.modal-body').length) {
            //     modal.close();
            // }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.infopopProvider.add(this);
    }
    getId() {
        return this.popoverId;
    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.infopopProvider.remove(this.popoverId);
        this.element.remove();
    }

    // open modal
    open(content : string, title : string): void {
        // this.element.show();
        this.content = content;
        this.title = title;
        this.parentElem.classList.add('modal-open');
    }

    // close modal
    close(): void {
        // this.element.hide();
        this.parentElem.classList.remove('modal-open');
    }
  shareClick(evt : Event) {
    this.infopopProvider.share(this.popoverId);
    // this.viewCtrl.dismiss({"action" : "share"});
  }
  dockPopup(evt: Event) {
    console.log(`got dockPopup event from ${this.title}`);
    // this.viewCtrl.dismiss({"action" : "undock"});
    this.minimized = ! this.minimized;
  }
  closePopup(evt: Event) {
    this.infopopProvider.close(this.popoverId);
    // this.viewCtrl.dismiss({"action" : "close"});
  }
}
