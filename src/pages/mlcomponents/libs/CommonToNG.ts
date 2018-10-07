import { DomService } from '../../../services/dom.service';
import { SharemapProvider } from '../../../providers/sharemap/sharemap';
import { GmpopoverProvider } from '../../../providers/gmpopover/gmpopover';

export interface ICommonToNG {
     domSvc : DomService,
     shareInfoSvc : SharemapProvider,
     gmpopoverSvc : GmpopoverProvider
}

export class CommonToNG  implements ICommonToNG {
  static libs : ICommonToNG;
  domSvc : DomService;
  shareInfoSvc : SharemapProvider;
  gmpopoverSvc : GmpopoverProvider;

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
