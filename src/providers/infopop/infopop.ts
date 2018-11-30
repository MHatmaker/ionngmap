import { HttpClient } from '@angular/common/http';
import { Injectable,
    EventEmitter,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef } from '@angular/core';
import * as _ from 'underscore';
import { v4 as uuid } from 'uuid';
import { MapInstanceService } from '../../services/MapInstanceService';
import { InfopopComponent } from '../../components/infopop/infopop';

/*
  Generated class for the InfopopProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InfopopProvider {
  public dockPopEmitter = new EventEmitter<{'action' : string, 'title' : string}>();
  private latestId : string;

  constructor(public mapInstanceService : MapInstanceService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,) {
    console.log('Hello InfopopProvider Provider');
  }

      private modals: any[] = [];
      private currentContent : string;
      private currentTitle : string;

      create(markerElement : Element, mapNumber : number, component : any, content : string, title : string) {
        let parentElem = document.getElementById('google-map-component' + mapNumber);
        console.log(parentElem);
        this.currentContent = content;
        this.currentTitle = title;

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
        return domElem;
      }

      add(modal: any) {
          // add modal to array of active modals
          this.modals.push(modal);
          this.latestId = modal.getId();
          modal.title = this.currentTitle;
          modal.content = this.currentContent;
      }
      getLatestId() : string {
        return this.latestId;
      }

      remove(id: string) {
          // remove modal from array of active modals
          let modalToRemove = _.findWhere(this.modals, { id: id });
          this.modals = _.without(this.modals, modalToRemove);
      }

      open(content : string, title : string, ngUid : string) {
          // open modal specified by id
          console.log('We are supposed to open a modal here in infopop provider');
          let modal = _.findWhere(this.modals, { id: ngUid });
          modal.open(content, title);
      }

      close(ngUid: string) {
          // close modal specified by id
          this.dockPopEmitter.emit({action : 'close', title : ngUid});
          let modal = _.find(this.modals, { ngUid: ngUid });
          modal.close();
      }
      share(id: string) {
          this.dockPopEmitter.emit({action : 'share', title : id});
      }
      undock(id: string) {
          this.dockPopEmitter.emit({action : 'undock', title : id});
      }
}
