
import { Injectable,
    EventEmitter,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef } from '@angular/core';
import { MarkeranimatorComponent } from '../../components/markeranimator/markeranimator';

/*
  Generated class for the MarkeranimatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MarkeranimatorProvider {
  private mapNumber : number;
  private domElem : HTMLElement;
  private x : number;
  private y : number;

  constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
    console.log('Hello MarkeranimatorProvider Provider');
  }
  create(mapNumber : number, x_pos : number, y_pos : number) {
    this.x = x_pos;
    this.y = y_pos;
    let parentElem = document.getElementById('google-map-component' + mapNumber);

    console.log(parentElem);
    this.mapNumber = mapNumber;

    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(MarkeranimatorComponent)
      .create(this.injector);

    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    // domElem.style.position = "absolute";
    // domElem.style.left = x_pos+'px';
    // domElem.style.top = y_pos+'px';

    // Append DOM element to the body
    parentElem.appendChild(domElem);
    this.domElem = domElem;
    return domElem;
  }

  getCoordinates() : { x : number, y : number} {
    return {x : this.x, y : this.y};
  }

}
