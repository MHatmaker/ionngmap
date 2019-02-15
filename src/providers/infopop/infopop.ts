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

class PopupItem {
  mapNumber : number;
  pop : any;
}
@Injectable()
export class InfopopProvider {
  public dockPopEmitter = new EventEmitter<{'action' : string, 'title' : string, 'labelShort' : string}>();
  private latestId : string;

  constructor(public mapInstanceService : MapInstanceService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
    console.log('Hello InfopopProvider Provider');
  }

      private modals: any[] = [];
      private modalMap : Map<string, PopupItem> = new Map<string, PopupItem>();
      private currentContent : string;
      private currentTitle : string;
      private mrkrlabel : string;
      private mapNumber : number;
      private uid : string;
      public show : boolean;
      private domElem : HTMLElement;

      create(markerElement : Element, mapNumber : number, component : any,
          content : string, title : string, lbl : string, uid : string, showHide : boolean = true) {
        let parentElem = document.getElementById('google-map-component' + mapNumber);
        console.log(`infpop.create for Id ${uid}, title ${title}`);
        console.log(parentElem);
        this.currentContent = content;
        this.currentTitle = title;
        this.mrkrlabel = lbl;
        this.mapNumber = mapNumber;
        this.uid = uid;
        this.show = showHide;

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

      add(modal: any) {
          // add modal to array of active modals
          this.modals.push(modal);
          this.latestId = this.uid; // uuid(); // modal.getId();
          modal.setId(this.latestId);
          modal.title = this.currentTitle;
          modal.content = this.currentContent;
          modal.mrkrlabel = this.mrkrlabel;
          modal.setShareShow(this.show);
          this.modalMap[this.latestId] = {mapNumber : this.mapNumber, pop : modal};
      }
      getLatestId() : string {
        return this.latestId;
      }

      remove(id: string) {
          // remove modal from array of active modals
          // let modalToRemove = _.findWhere(this.modals, { id: id });
          // this.modals = _.without(this.modals, modalToRemove);
          let parentElem = document.getElementById('google-map-component' + this.mapNumber);
          let elemToRemove = this.modalMap[id].pop.element;
          parentElem.removeChild(elemToRemove);
          this.modalMap.delete(id);
      }

      open(content : string, title : string, ngUid : string) {
          // open modal specified by id
          console.log('We are supposed to open a modal here in infopop provider');
          // let modal = _.findWhere(this.modals, { id: ngUid });
          let modal = this.modalMap[ngUid];
          modal.open(content, title);
      }

      close(ngUid: string) {
          // close modal specified by id
          this.dockPopEmitter.emit({action : 'close', title : ngUid, 'labelShort' : ""});
          // let modal = _.find(this.modals, { ngUid: ngUid });
          let modal = this.modalMap[ngUid];
          modal.pop.close();
          this.remove(ngUid);
          // this.modalMap.delete(ngUid);
      }
      share(id: string) {
          console.log(`infopop emitting share action with title (id) : ${id}`);
          let modal = this.modalMap[id];
          this.dockPopEmitter.emit({action : 'share', title : id, 'labelShort' : modal.mrkrlabel});
      }
      undock(id: string) {
          this.dockPopEmitter.emit({action : 'undock', title : id, 'labelShort' : ""});
      }
      contains(id : string) : boolean {
        return _.contains(this.modals, id);
      }
      subset(id : string) : any[] {
        let modalToSkip = _.findWhere(this.modals, {id : id});
        return _.without(this.modals, modalToSkip);
      }
}
