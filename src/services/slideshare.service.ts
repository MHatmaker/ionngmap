import { Injectable, EventEmitter } from '@angular/core';
import { ISlideData } from "../../../services/slidedata.interface";

@Injectable()
export class SlideShareService {
    slideData = new EventEmitter<ISlideData>();
    slideRemove = new EventEmitter();
}
