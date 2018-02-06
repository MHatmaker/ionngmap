import {Injectable, EventEmitter} from '@angular/core';
import { MenuOptionModel } from './../side-menu-content/models/menu-option-model';

@Injectable()
export class PageService {
    currentPage : string = 'map';
    currentMapType : string = 'google';
    menuOption = new EventEmitter<MenuOptionModel>();

    constructor() {
    }

    setPage (p : string) {
        this.currentPage = p;
    }

    setMap (m : string) {
        this.currentMapType = m;
    }
}
