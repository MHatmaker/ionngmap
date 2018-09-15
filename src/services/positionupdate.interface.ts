import { mlBounds } from '../pages/mlcomponents/libs/mlBounds.interface';
import { EMapSource } from '../services/configparams.service';

export interface IPositionParams {
    zm : number,
    scl : number,
    cntrlng : string,
    cntrlat: string,
    evlng : string,
    evlat : string
};
export interface IPositionData {
    key : string,
    val : IPositionParams
};

export interface MapLocCoords {
    lat : number,
    lng : number
}

export interface MapLocOptions {
    center : MapLocCoords,
    zoom : number,
    places : any,
    query : string
}

export interface IMapShare {
  mapLocOpts : MapLocOptions,
  userName : string,
  mlBounds : mlBounds,
  source : EMapSource,
  webmapId : string
}
