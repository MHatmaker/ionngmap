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
