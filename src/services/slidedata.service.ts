import { Injectable } from '@angular/core';
import { ISlideData } from './slidedata.interface'

@Injectable()
export class SlideData {

    constructor(private mapListItem : any, private slideNumber : number, private mapName : string) {
    }
};
