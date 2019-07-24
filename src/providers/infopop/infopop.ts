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
  public dockPopEmitter = new EventEmitter<{'action' : string, 'title' : string, 'labelShort' : string,
    position : {'x' : number, 'y' : number}}>();
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
      private geopos : {'lng' : number, 'lat' : number};
      private pos : any;
      private popupId : string;
      public show : boolean;
      private domElem : HTMLElement;

      create(markerElement : google.maps.Marker, mapNumber : number, component : any,
          content : string, title : string, lbl : string, popupId : string, showHide : boolean = true) {
        let parentElem = document.getElementById('google-map-component' + mapNumber);
        // console.log(`infpop.create for Id ${popupId}, title ${title}`);
        console.log(parentElem);
        this.currentContent = content;
        this.currentTitle = title;
        this.mrkrlabel = lbl;
        this.mapNumber = mapNumber;
        this.popupId = popupId;
        this.show = showHide;

        this.geopos = {"lng" : markerElement.getPosition().lng(), "lat" : markerElement.getPosition().lat()};
        this.pos = this.project(markerElement.getPosition());

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
          this.latestId = this.popupId; // modal.getId();
          modal.setId(this.latestId);
          modal.title = this.currentTitle;
          modal.content = this.currentContent;
          modal.mrkrlabel = this.mrkrlabel;
          modal.setShareShow(this.show);
          modal.setCoordinates(this.geopos)
          // this.modalMap[this.latestId] = {mapNumber : this.mapNumber, pop : modal};
          this.modalMap.set(this.latestId, {mapNumber : this.mapNumber, pop : modal});
      }
      getLatestId() : string {
        return this.latestId;
      }

      hasModal(popupId : string, mapNum) : boolean {
          let firstTest = this.modalMap.has(popupId);
          // if (firstTest === true) {
          //     return this.modalMap.get(popupId).mapNumber === mapNum ? true : false;
          // }
          // return false;
          return firstTest;
      }

      remove(id: string) {
          // remove modal from array of active modals
          // let modalToRemove = _.findWhere(this.modals, { id: id });
          // this.modals = _.without(this.modals, modalToRemove);
          let mapNo = this.modalMap.get(id).mapNumber;
          let parentElem = document.getElementById('google-map-component' + mapNo);
          let elemToRemove = this.modalMap.get(id).pop.element;
          parentElem.removeChild(elemToRemove);
          this.modalMap.delete(id);
      }

      open(content : string, title : string, ngUid : string) {
          // open modal specified by id
          console.log('We are supposed to open a modal here in infopop provider');
          // let modal = _.findWhere(this.modals, { id: ngUid });
          let modal = this.modalMap.get(ngUid);
          // modal.open(content, title);
      }

      close(ngUid: string) {
          // close modal specified by id
          this.dockPopEmitter.emit({action : 'close', title : ngUid, 'labelShort' : "", "position" : this.pos});
          // let modal = _.find(this.modals, { ngUid: ngUid });
          let modal = this.modalMap.get(ngUid); //[ngUid];
          if(modal) {
            modal.pop.close();
          }
          this.remove(ngUid);
          // this.modalMap.delete(ngUid);
      }
      share(id: string) {
          // console.log(`infopop emitting share action with title (id) : ${id}`);
          let modal = this.modalMap.get(id);
          this.dockPopEmitter.emit({action : 'share', title : id, 'labelShort' : modal.pop.mrkrlabel, "position" : this.pos});
      }
      undock(id: string) {
          let modal = this.modalMap.get(id);
          let coords = modal.pop.getCoordinates();
          let latlng = new google.maps.LatLng(coords.lng, coords.lat);
          // let pos = this.project(latlng);
          let pos = {'x' : coords.lng, 'y' : coords.lat};
          this.dockPopEmitter.emit({action : 'undock', title : id, 'labelShort' : "", "position" : pos});
      }
      contains(id : string) : boolean {
        return _.contains(this.modals, id);
      }
      subset(id : string) : any[] {
        let modalToSkip = _.findWhere(this.modals, {id : id});
        return _.without(this.modals, modalToSkip);
      }
  // The mapping between latitude, longitude and pixels is defined by the web
      // mercator projection.
      project(latLng) : google.maps.Point{
        let siny = Math.sin(latLng.lat() * Math.PI / 180);
        let TILE_SIZE = 256;

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);

        return new google.maps.Point(
            TILE_SIZE * (0.5 + latLng.lng() / 360),
            TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
        }
}
