import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { utils } from '../../pages/mlcomponents/libs/utils';
import { loadModules } from 'esri-loader';

export interface IAgoGroupItem {
  id : string,
  title : string,
  snippet : string,
  thumbnailUrl : string
}

Injectable()
export class AgoGroupItem implements IAgoGroupItem {

    constructor( public id : string,  public title : string,  public snippet : string, public thumbnailUrl : string) {
    }
};

@Injectable()
export class AgoqueryProvider {
  private portalForSearch : any;

  constructor(public http: HttpClient, private utils : utils) {
    this.loadPortal();
  }
  async loadPortal() {
      const options = {
        url: 'https://js.arcgis.com/4.7/'
      };
      const [ portal ] = await loadModules(
        ['esri/portal/Portal'], options);

      // utils.  showLoading();
      console.log('findArcGISGroup');
      this.portalForSearch = new portal();
      this.portalForSearch.authMode = 'immediate';
      this.portalForSearch.load().then( ()=>{
        console.log("portal loaded");
      });

  }

  simplifyResults(d) {
    let items : Array<IAgoGroupItem> = new Array<IAgoGroupItem>()
    d.forEach((itm) => {
      items.push(new AgoGroupItem(itm.id, itm.title, itm.snippet, itm.thumbnailUrl));
    });
    return items;
  }

  async findArcGISGroup(searchTermGrp) {
      const options = {
        url: 'https://js.arcgis.com/4.7/'
      };
      const [ portal, PortalQueryParams ] = await loadModules(
        ['esri/portal/Portal', 'esri/portal/PortalQueryParams'], options);

      // utils.  showLoading();
      var
          portalQueryParams = {
              query:  searchTermGrp,
              num: 20  //find 40 items - max is 100
          };
      console.log('findArcGISGroup');
      let data = await this.portalForSearch.queryGroups(portalQueryParams);
      return this.simplifyResults(data.results);
  };
}
