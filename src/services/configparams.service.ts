import { Injectable } from '@angular/core';
import { IPosition, MLPosition } from './position.service';

export interface IConfigParams {
    mapId : number;
    mapType : string;
    webmapId : string;
    mlposition : IPosition;
}

console.log("loading ConfigParams");

@Injectable()
export class ConfigParams implements IConfigParams{

    constructor(
         public mapId : number  = -1,
         public mapType : string,
         public webmapId : string,
         public mlposition : IPosition) {

    }
};
