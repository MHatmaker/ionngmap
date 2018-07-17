import { DomService } from '../../../services/dom.service';
import { SharemapProvider } from '../../../providers/sharemap/sharemap';

export interface ICommonToNG {
     domSvc : DomService,
     shareInfoSvc : SharemapProvider
}

export class CommonToNG  implements ICommonToNG {
  static libs : ICommonToNG;
  domSvc : DomService;
  shareInfoSvc : SharemapProvider;

  // constructor(libs : ICommonToNG) {
  //
  // }
  static setLibs(s : ICommonToNG) {
    CommonToNG.libs = s;
  }
  static getLibs() : ICommonToNG
{
  return CommonToNG.libs;
}}
