import { Injectable } from '@angular/core';
// import { ISlideData } from './slidedata.interface'

@Injectable()
export class SlideData {

    constructor(private mapListElement : any, private slideNumber : number, private mapName : string) {
    }
};
