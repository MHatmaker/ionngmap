
export class CommonToNG {
  static libs = {
    svc : null
  }
  static setLibs(s) {
    CommonToNG.libs.svc = s;
  }
  static getLibs()
{
  return CommonToNG.libs.svc;
}}
