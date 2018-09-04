import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';


@Component({
  selector: 'accordion-list',
  templateUrl: 'accordion-list.html'
})
export class AccordionListComponent {
   @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
    @Input('expanded') expanded;

    constructor(public renderer: Renderer) {

    }

    ngAfterViewInit(){
        // this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', 'auto'); //this.itemExpandHeight + 'px');
      // if(this.expandHeight){
      //   this.renderer.setElementStyle(this.wrapper.nativeElement, 'height', this.expandHeight + 'px');
      // }
    }

}
