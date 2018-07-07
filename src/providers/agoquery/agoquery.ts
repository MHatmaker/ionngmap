import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { utils } from '../../pages/mlcomponents/libs/utils';
import { loadModules } from 'esri-loader';

@Injectable()
export class AgoqueryProvider {

  constructor(public http: HttpClient, private utils : utils) {
    console.log('Hello AgoqueryProvider Provider');
  }
  async findArcGISGroup(searchTermGrp) {
      const options = {
        url: 'https://js.arcgis.com/4.7/'
      };
      const [ portal, PortalQueryParams ] = await loadModules(
        ['esri/portal/Portal', 'esri/portal/PortalQueryParams'], options);

      // utils.  showLoading();
      console.log('findArcGISGroup');
      let portalForSearch = new portal();
      portalForSearch.authMode = 'immediate';
      portalForSearch.load().then( ()=>{
        var
            PortalQueryParams = {
                query:  searchTermGrp,
                num: 20  //find 40 items - max is 100
            };
        portalForSearch.queryGroups(PortalQueryParams).then(function (data) {
            return(data);
      });
    });
  };
}
