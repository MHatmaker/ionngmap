import { Injectable } from '@angular/core';
import { IPosition } from './position.service';

export enum EMapSource {
  srcmenu,
  srcagonline,
  srcgoogle,
  srcleaflet,
  urlagonline,
  urlgoogle,
  urlleaflet,
  sharegoogle,
  placesgoogle
}

export interface IConfigParams {
    mapId : number;
    mapType : string;
    webmapId : string;
    mlposition : IPosition;
    source : EMapSource
}

console.log("loading ConfigParams");

@Injectable()
export class ConfigParams implements IConfigParams{

    constructor(
         public mapId : number  = -1,
         public mapType : string,
         public webmapId : string,
         public mlposition : IPosition,
         public source : EMapSource) {

    }
};
