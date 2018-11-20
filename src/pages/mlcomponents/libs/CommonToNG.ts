import { DomService } from '../../../services/dom.service';
import { SharemapProvider } from '../../../providers/sharemap/sharemap';
import { GmpopoverProvider } from '../../../providers/gmpopover/gmpopover';
import { InfopopProvider } from '../../../providers/infopop/infopop';

export interface ICommonToNG {
     domSvc : DomService,
     shareInfoSvc : SharemapProvider,
     gmpopoverSvc : GmpopoverProvider,
     infopopSvc : InfopopProvider
}

export class CommonToNG  implements ICommonToNG {
  static libs : ICommonToNG;
  domSvc : DomService;
  shareInfoSvc : SharemapProvider;
  gmpopoverSvc : GmpopoverProvider;
  infopopSvc : InfopopProvider;

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
