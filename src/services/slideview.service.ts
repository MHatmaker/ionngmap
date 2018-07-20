import { Injectable } from '@angular/core';

@Injectable()
export class SlideViewService {
    mapcolheight = 550;

    setMapColHeight(h : number) {
        this.mapcolheight = h;
    }
    getMapColHeight() {
        return this.mapcolheight;
    }
}
