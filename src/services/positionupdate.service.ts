import { Injectable, EventEmitter } from '@angular/core';
import { IPositionData } from './positionupdate.interface'

@Injectable()
export class PositionUpdateService {
    positionData = new EventEmitter<IPositionData>();
}
