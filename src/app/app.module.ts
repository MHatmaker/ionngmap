import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Geolocation } from '@ionic-native/geolocation';
import { Proj } from 'proj4';
import "leaflet";

// import { MapView } from 'esri/views/MapView';
import { Point } from 'esri/geometry';
import { SpatialReference } from 'esri/geometry';
import { Geometry } from 'esri/geometry';

import { MapLinkrApp } from './app.component';
import { MapsPage } from '../pages/maps/map.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';// Custom components
import { SideMenuContentComponent } from '../side-menu-content/side-menu-content.component';

import { PlacesSearchComponent } from '../pages/mlcomponents/PlacesSearch/places.component';
import { EsriMapComponent } from '../pages/mlcomponents/EsriMap/esrimap.component';
import { GoogleMapComponent } from '../pages/mlcomponents/GoogleMap/googlemap.component';
import { LeafletMapComponent } from '../pages/mlcomponents/LeafletMap/leafletmap.component';
import { ESRIMapService } from '../services/esrimap.service';
import { MultiCanvasEsri } from '../pages/mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../pages/mlcomponents/MultiCanvas/multicanvasgoogle.component';
import { MultiCanvasLeaflet } from '../pages/mlcomponents/MultiCanvas/multicanvasleaflet.component';

// import { CoordinateComponent } from '../pages/mlcomponents/coordinate/coordinate.component';
import { CarouselComponent } from '../pages/mlcomponents/Carousel/carousel.component';
// import { DomService } from '../services/dom.service';
import { MapInstanceService } from '../services/MapInstanceService';
import { CanvasService } from '../services/CanvasService';
import { SlideShareService } from '../services/slideshare.service';
import { PageService } from '../services/pageservice'
import { PusherConfig } from '../pages/mlcomponents/libs/PusherConfig'
import { HostConfig } from '../pages/mlcomponents/libs/HostConfig'
import { utils } from '../pages/mlcomponents/libs/utils';
import { Startup } from '../pages/mlcomponents/libs/Startup';
import { StartupGoogle } from '../pages/mlcomponents/libs/StartupGoogle';
import { MapHoster } from '../pages/mlcomponents/libs/MapHoster';
import { MapHosterGoogle } from '../pages/mlcomponents/libs/MapHosterGoogle';

@NgModule({
  declarations: [
    MapLinkrApp,
    MapsPage,
    SideMenuContentComponent,
    PlacesSearchComponent,
    EsriMapComponent,
    GoogleMapComponent,
    LeafletMapComponent,
    MultiCanvasEsri,
    MultiCanvasGoogle,
    MultiCanvasLeaflet,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MapLinkrApp),
    NgbModule.forRoot(),
    /*
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      // url: 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAwAOGAxY5PZ8MshDtaJFk2KgK7VYxArPA',
      apiKey: 'AIzaSyAwAOGAxY5PZ8MshDtaJFk2KgK7VYxArPA',
      libraries: ["places"]
    }),*/
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MapLinkrApp,
    MapsPage,
    MultiCanvasEsri,
    MultiCanvasGoogle,
    MultiCanvasLeaflet,
    EsriMapComponent,
    GoogleMapComponent,
    LeafletMapComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ESRIMapService,
    CanvasService,
    MapInstanceService,
    SlideShareService,
    PageService,
    PusherConfig,
    HostConfig,
    utils,
    Startup,
    StartupGoogle,
    MapHoster,
    MapHosterGoogle,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
