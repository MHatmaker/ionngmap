import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// import { MapView } from 'esri/views/MapView';
// import { Point } from 'esri/geometry/Point';
// import { SpatialReference } from 'esri/geometry/SpatialReference';

import { MapLinkrApp } from './app.component';
import { MapsPage } from '../pages/maps/map.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';// Custom components
import { SideMenuContentComponent } from '../side-menu-content/side-menu-content.component';

import { PlacesSearchComponent } from '../pages/mlcomponents/PlacesSearch/places.component';
import { EsriMapComponent } from '../pages/mlcomponents/EsriMap/esrimap.component';
import { GoogleMapComponent } from '../pages/mlcomponents/GoogleMap/googlemap.component';
import { ESRIMapService } from '../services/esrimap.service';
import { MultiCanvasEsri } from '../pages/mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../pages/mlcomponents/MultiCanvas/multicanvasgoogle.component';

// import { CoordinateComponent } from '../pages/mlcomponents/coordinate/coordinate.component';
import { CarouselComponent } from '../pages/mlcomponents/Carousel/carousel.component';
// import { DomService } from '../services/dom.service';
import { MapInstanceService } from '../services/MapInstanceService';
import { CanvasService } from '../services/CanvasService';
import { SlideShareService } from '../services/slideshare.service';
import { PageService } from '../services/pageservice'
@NgModule({
  declarations: [
    MapLinkrApp,
    MapsPage,
    HomePage,
    SideMenuContentComponent,
    PlacesSearchComponent,
    EsriMapComponent,
    GoogleMapComponent,
    MultiCanvasEsri,
    MultiCanvasGoogle,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MapLinkrApp),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      // url: 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAwAOGAxY5PZ8MshDtaJFk2KgK7VYxArPA',
      apiKey: 'AIzaSyAwAOGAxY5PZ8MshDtaJFk2KgK7VYxArPA',
      libraries: ["places"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MapLinkrApp,
    MapsPage,
    HomePage,
    MultiCanvasEsri,
    MultiCanvasGoogle,
    EsriMapComponent,
    GoogleMapComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ESRIMapService,
    CanvasService,
    MapInstanceService,
    SlideShareService,
    PageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
