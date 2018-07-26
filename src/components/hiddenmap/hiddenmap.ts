import { Component, ViewChild, ElementRef } from '@angular/core';
import { MapopenerProvider } from "../../providers/mapopener/mapopener";
import { MapLocOptions } from '../../services/positionupdate.interface';
import { CanvasService } from '../../services/CanvasService';
import { GeoPusherSupport } from '../../pages/mlcomponents/libs/geopushersupport';
import { PusherEventHandler } from '../../pages/mlcomponents/libs/PusherEventHandler';
import { MapInstanceService } from '../../services/MapInstanceService';

declare var google;

@Component({
  selector: 'hiddenmap',
  templateUrl: 'hiddenmap.html'
})
export class HiddenmapComponent {
@ViewChild('hiddenmap') mapElement : ElementRef;
    map: any;
    pusherEventHandler : PusherEventHandler;
    private hiddenMapCreated : boolean = false;

  constructor(mapOpener : MapopenerProvider, private canvasService : CanvasService, private geopush : GeoPusherSupport,
      private mapInstanceService : MapInstanceService) {
    console.log('Hello HiddenmapComponent Component');
      mapOpener.openMap.subscribe(
          (data : MapLocOptions) => {
            if (this.hiddenMapCreated == false) {
              this.hiddenMapCreated = true;
              this.addHiddenCanvas();
            }
      });
  }

  addHiddenCanvas(){
    let mapOptions = this.canvasService.getInitialLocation();

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    console.log("Add pusher event handler for hidden map");
    this.mapInstanceService.setHiddenMap(this.map);

    this.pusherEventHandler = new PusherEventHandler(-1);
    this.pusherEventHandler.addEvent('client-MapXtntEvent', (xj) => this.onPan(xj));
    this.pusherEventHandler.addEvent('client-MapClickEvent', (pt) => {});
    this.geopush.IgeoPusher.pusherClientService.createHiddenPusherClient(this.pusherEventHandler.getEventDct());
  }
  onPan(xj){
    let cntr = new google.maps.LatLng(xj.lat, xj.lon);
    this.map.setCenter(cntr);
    this.map.setZoom(xj.zoom);
  }

}
