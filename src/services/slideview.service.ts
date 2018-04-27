import { Injectable } from '@angular/core';

@Injectable()
export class SlideViewService {
    mapcolheight = 400;

    setMapColHeight(h : number) {
        this.mapcolheight = h;
    }
    getMapColHeight() {
        return this.mapcolheight;
    }
}
