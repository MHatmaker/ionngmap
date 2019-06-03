import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { utils } from '../../pages/mlcomponents/libs/utils';
import { loadModules } from 'esri-loader';
import { MLBounds, ImlBounds } from '../../services/mlbounds.service';

export interface IAgoGroupItem {
  id : string,
  title : string,
  snippet : string,
  thumbnailUrl : string
}
export interface IAgoItem {
  id : string,
  title : string,
  snippet : string,
  thumbnailUrl : string,
  itemUrl : string,
  defaultExtent : ImlBounds
}

@Injectable()
export class AgoGroupItem implements IAgoGroupItem {

    constructor( public id : string,  public title : string,  public snippet : string,
      public thumbnailUrl : string) {
    }
};

@Injectable()
export class AgoItem implements IAgoItem {

    constructor( public id : string,  public title : string,  public snippet : string,
      public thumbnailUrl : string, public itemUrl : string, public defaultExtent : ImlBounds) {
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
        url: 'https://js.arcgis.com/4.11/'
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

  simplifyGroupResults(d) {
    let items : Array<IAgoGroupItem> = new Array<IAgoGroupItem>()
    d.forEach((itm) => {
      items.push(new AgoGroupItem(itm.id, itm.title, itm.snippet, itm.thumbnailUrl));
    });
    return items;
  }
  simplifyItemResults(d) {
    let items : Array<IAgoItem> = new Array<IAgoItem>()
    d.forEach((itm) => {
      if (itm.type == 'Web Map') {
        let xtnt = itm.extent;
        let bnds = new MLBounds(xtnt.xmin, xtnt.ymin, xtnt.xmax, xtnt.ymax);
        console.log(`item name : ${itm.title}, type : ${itm.type}, isLayer : ${itm.isLayer}`);
        items.push(new AgoItem(itm.id, itm.title, itm.snippet, itm.thumbnailUrl, itm.itemUrl, bnds));
      }
    });
    return items;
  }

  async findArcGISGroup(searchTermGrp) {
      const options = {
        url: 'https://js.arcgis.com/4.11/'
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
      return this.simplifyGroupResults(data.results);
  };

  async findArcGISItem(searchTermItem) {
      const options = {
        url: 'https://js.arcgis.com/4.11/'
      };
      const [ portal, PortalQueryParams ] = await loadModules(
        ['esri/portal/Portal', 'esri/portal/PortalQueryParams'], options);

      // utils.  showLoading();
      var
          portalQueryParams = {
              query:  searchTermItem,
              num: 20  //find 40 items - max is 100
          };
      console.log('findArcGISItem');
      let data = await this.portalForSearch.queryItems(portalQueryParams);
      return this.simplifyItemResults(data.results);
  };

}
