import {
    Injectable,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef,
    ComponentRef
} from '@angular/core';

// import {MultiCanvasGoogle} from '../MultiCanvas/multicanvasgoogle.component';

@Injectable()
export class CanvasService {
    private ndx : number;
    private canvases : Array<any> = new Array<any>();

    constructor (
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
      ){
    }

    getIndex () {
        return this.ndx;
    }
    appendNewCanvasToContainer(component : any, ndx : number) {
        this.ndx = ndx;
        this.canvases.push(component);
        var mapParent = document.getElementsByClassName('MapContainer')[0];
        // Create a component reference from the component
        const componentRef = this.componentFactoryResolver
          .resolveComponentFactory(component)
          .create(this.injector);

        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;

        // Append DOM element to the body
        mapParent.appendChild(domElem);
        return domElem;
    }
    /*
    makeCanvasSlideListItem (ndx) {
        var newCanvasItem = document.createElement('li');
        newCanvasItem.id = "slide" + ndx;
        return newCanvasItem;
    }
    loadCanvasSlideListItem (elem, ndx) {
        this.canvases.push(new MultiCanvas.Canvas(elem, ndx));
        this.canvases[this.canvases.length - 1].init();
    }
    */
    getCanvasSlideListItem (ndx) {
        return this.canvases[ndx];
    };

}
