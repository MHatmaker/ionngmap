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
  private items : any;

  constructor(public httpClient: HttpClient, private utils : utils) {
    // this.loadPortal();
  }
  async loadPortal() {
      const options = {
        url: 'https://js.arcgis.com/4.8/'
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
        let bnds = new MLBounds(xtnt[0][0], xtnt[0][1], xtnt[1][0], xtnt[1][1]);
        console.log(`item name : ${itm.title}, type : ${itm.type}, isLayer : ${itm.isLayer}`);
        let thumbUrl = 'https://darcadian.maps.arcgis.com/sharing/rest/content/items/' + itm.id + '/info/' + itm.thumbnail;
        console.log('itemUrl ' + itm.itemUrl);
        console.log('thumbnailUrl ' + thumbUrl);
        items.push(new AgoItem(itm.id, itm.title, itm.snippet, thumbUrl, itm.itemUrl, bnds));
      }
    });
    return items;
  }

  async findArcGISGroup(searchTermGrp) {
      const options = {
        url: 'https://js.arcgis.com/4.8/'
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
    const url : string = 'https://www.arcgis.com/sharing/rest/search?q=' + searchTermItem + '&f=pjson';
    let fetchedItems = await this.httpClient.get(url).toPromise();
    console.log(fetchedItems);
        let simp = this.simplifyItemResults(fetchedItems['results']);
        console.log(simp);
        /*
    let unpacked = await fetchedItems.subscribe(
      data => {
        this.items = data;
      },
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => {
        console.log('done loading items');
        console.log(this.items);
        let simp = this.simplifyItemResults(this.items.results);
        console.log(simp);
        return simp;
      }
    );*/
    // console.log(unpacked);
    // console.log(fetchedItems);
    // return fetchedItems;
        return simp;
  };

}
