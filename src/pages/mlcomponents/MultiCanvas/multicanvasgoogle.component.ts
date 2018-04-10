import { Component } from '@angular/core';
import { CanvasService } from '../../../services/CanvasService';

@Component({
  selector: 'multi-canvas-google',
  templateUrl: './multicanvasgoogle.component.html',
  styles: ['./multicanvas.component.css']
})

export class MultiCanvasGoogle {
    // private el : string = null;
    private ndx : number = null;
    private mapcolheight : number = 510;
    public slidevisibility : string = "multi-can-current";

    constructor(private canvasService: CanvasService) {
        this.ndx = this.canvasService.getIndex();
        console.log("ndx is " + this.ndx);
        this.canvasService.setCurrent.subscribe((sn: number) =>{
            console.log(`subscriber received id ${sn}`)
            if(sn == this.ndx) {
              this.slidevisibility = "multi-can-current";
            } else {
              this.slidevisibility = "multi-can-active";
            }
        });
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
