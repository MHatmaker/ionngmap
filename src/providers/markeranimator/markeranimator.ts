
import { Injectable,
    EventEmitter,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef } from '@angular/core';

/*
  Generated class for the MarkeranimatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MarkeranimatorProvider {
  private mapNumber : number;
  private domElem : HTMLElement;

  constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
    console.log('Hello MarkeranimatorProvider Provider');
  }
  create(mapNumber : number, component : any) {
    let parentElem = document.getElementById('google-map-component' + mapNumber);

    console.log(parentElem);
    this.mapNumber = mapNumber;

    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // Append DOM element to the body
    parentElem.appendChild(domElem);
    this.domElem = domElem;
    return domElem;
  }

}
