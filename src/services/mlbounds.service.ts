import { Injectable } from '@angular/core';

export interface ImlBounds {
    llx : number,
    lly : number,
    urx : number,
    ury : number
};


console.log("loading MLBounds");

@Injectable()
export class MLBounds implements ImlBounds {

    constructor( public llx : number,  public lly : number,  public urx : number, public ury : number) {
    }
};
