
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgZone} from '@angular/core';
import { MapInstanceService } from '../../../services/MapInstanceService';
import { SlideShareService } from '../../../services/slideshare.service';
import { ISlideData } from "../../../services/slidedata.interface";
import { CanvasService } from "../../../services/CanvasService";
import { SlideViewService } from "../../../services/slideview.service";
import { DoublyLinkedList, DoublyLinkedListNode } from "../libs/DoublyLinkedList";

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
    //console.log("Carousel : ready to set up Carousel");
    private items : DoublyLinkedList<ISlideData> = new DoublyLinkedList<ISlideData>();
    private activeSlideNumber : number = 0;
    private activeSlide : DoublyLinkedListNode<ISlideData> = null;
    // private currentSlide : ISlideData;
    private MapNo : number = 0;
    private MapName : string = "";
    // scope template variables
    private mapcolheight : number = 510;
    private mapcolWidth : number = window.innerWidth;
    private slidesCount : number = 0;
    private showNavButtons : boolean = false;
    private showMapText : boolean = false;
    private ActNoAct : string = 'active';

  constructor(private mapInstanceService: MapInstanceService, private slideshareService : SlideShareService,
      private canvasService : CanvasService, private _ngZone: NgZone, private slideViewService : SlideViewService) {
        console.log("Carousel ctor");
        this.mapcolheight = slideViewService.getMapColHeight();
        // this.currentSlide = this.items[0] || null;
        this.slideshareService.slideData.subscribe(
          (data: ISlideData) => {
            console.log(data);
            this.onAddSlide(data);
          });
        this.slideshareService.slideRemove.subscribe(
            (val : number) => {console.log("remove a slide");
            this.onRemoveSlide();
          });
    }

    onUpdate(event) {
        console.log("onUpdate in CarouselComponent");
        console.debug(event);
      }
    // navigate through the carousel
    private navigate(direction : number) {
        // hide the old currentSlide list item
        // this.currentSlide.classList.remove('carousel-current');
        // this.currentSlide.classList.add('carousel-basic');

        console.log("change activeSlideNumber from " +this. activeSlideNumber);
        // calculate the new position

        if (direction < 0) {
          if (this.activeSlide.prev) {
            this.activeSlide = this.activeSlide.prev;
          } else {
            this.activeSlide = this.items.tail;
          }
        } else {
          if (this.activeSlide.next) {
            this.activeSlide = this.activeSlide.next;
          } else {
            this.activeSlide = this.items.head;
          }
        }
        this.activeSlideNumber = (this.activeSlideNumber + direction) % this.slidesCount;
        this.activeSlideNumber = this.activeSlideNumber < 0 ? this.slidesCount - 1 : this.activeSlideNumber;
        console.log("to activeSlideNumber " + this.activeSlideNumber);
        // set new currentSlide element
        // and add CSS class
        // this.currentSlide = this.items.valueAtOffset(this.activeSlideNumber).mapListElement;
        this.MapNo = this.activeSlide.value.slideNumber;
        this.MapName = this.activeSlide.value.mapName;
        let slideNo = this.items.valueAtOffset(this.activeSlideNumber).slideNumber;
        this.canvasService.setCurrent.emit(this.MapNo);
        this.mapInstanceService.setCurrentSlide(this.MapNo);
    }

    onAddSlide (slideData : ISlideData) {
        console.log("Carousel Component onAddSlide to DoublyLinkedList");
        console.debug(slideData);
        this.items.add(slideData);
        this.activeSlide = this.items.tail;
        // this.currentSlide = this.items.tailValue().mapListElement; //[this.items.length - 1].mapListElement;
        this.activeSlideNumber = this.activeSlide.value.slideNumber;
        this.MapName = slideData.mapName;
        this.canvasService.setCurrent.emit(this.activeSlideNumber);

        this.slidesCount = this.items.listLength();
        this.showNavButtons = this.slidesCount  > 1;
        this.showMapText = this.slidesCount > 0;
    }
    onRemoveSlide () : number {
        var slideToRemove = this.activeSlide.value.slideNumber,
              slideElement = document.getElementById('slide' + slideToRemove).parentElement;
        console.log("remove slide " + slideToRemove);
        if (slideToRemove > -1) {
            //slide being removed must unsubscribe??????
            // this.items.removeNode(slideToRemove); //splice(slideToRemove, 1);
            console.log(this.items.values());
            // for(let val : DoublyLinkedListNode<ISlideData> of this.items.values) {
            //   if (val)
            let v = this.items.values()
            let itm = v.next();
            while(itm.done == false) {
              console.log(itm.value.mapName);
              itm = v.next();
            }
            let n = this.items.nodes();
            let nd : DoublyLinkedListNode<ISlideData> = this.items.head;
            while(nd) {
              if(nd.value.mapName == this.activeSlide.value.mapName) {
                this.items.removeNode(nd);
              }
              nd = nd.next;
            }

            this.slidesCount = this.items.listLength();
            this.showNavButtons =this.slidesCount  > 1;
            this.showMapText = this.slidesCount > 0;
            console.log("items length is now " + this.items.listLength());
            if (slideToRemove) {
                slideElement.remove();
            }
            this.navigate(-1);
            return 0;
        }

    }
    // add event handlers to buttons
    onClickNext () {
        this.navigate(1);
    }
    onClickPrev () {
        this.navigate(-1);
    }

    getCurrentSlideNumber () {
        return this.activeSlide.value.slideNumber;
    }


}
