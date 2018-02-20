export interface IPositionParams {
    zm : number,
    scl : number,
    cntrlng : number,
    cntrlat: number,
    evlng : string,
    evlat : string
};
export interface IPositionData {
    key : string,
    val : IPositionParams
};
