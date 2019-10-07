import { Component, OnDestroy } from '@angular/core';
import { CanvasService } from '../../../services/CanvasService';
import { SlideViewService } from '../../../services/slideview.service';

@Component({
  selector: 'multi-canvas-google',
  templateUrl: './multicanvasgoogle.component.html',
  styles: ['./multicanvas.component.css']
})

export class MultiCanvasGoogle implements OnDestroy {
    // private el : string = null;
    private currentSubscription;
    private ndx : number = 0;
    public slidevisibility : string = "multi-can-current";

    constructor(private canvasService: CanvasService, private slideViewService : SlideViewService) {
    }
    ngOnInit() {
        this.ndx  = this.canvasService.getIndex();
        console.log("ndx is " + this.ndx);
        this.currentSubscription = this.canvasService.setCurrent.subscribe((sn: number) =>{
            console.log(`subscriber ndx ${this.ndx} received id ${sn}`)
            if(sn == this.ndx) {
              this.slidevisibility = "multi-can-current";
            } else {
              this.slidevisibility = "multi-can-active";
            }
        });
    }
    ngOnDestroy() {
        this.currentSubscription.unsubscribe();
    }
    /*
            Canvas.prototype.init = function () {
                var mapParent = document.getElementsByClassName('MapContainer')[0];

                this.el.style.backgroundColor = "#888";
                // this.el.addEventListener("mousedown", this.onMouseDown.bind(this));
                // this.el.addEventListener("mousemove", this.onMouseMove.bind(this));

                mapParent.appendChild(this.el);
            };
      */

    onMouseDown (event) {
        console.log('onMouseDown: '); //, this.el);
        console.log(event.srcElement);
        // event.cancelBubble=true;
        // event.stopPropagation();
    }

    onMouseMove (event) {
        //console.log('onMouseMove: ', this.el);
        event.preventDefault();
        // event.cancelBubble=true;
        // event.stopPropagation();
    }
}
