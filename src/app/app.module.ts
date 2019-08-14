import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Geolocation } from '@ionic-native/geolocation';
// import { Proj } from 'proj4';
import "leaflet";

// import { MapView } from 'esri/views/MapView';
// import { Point } from 'esri/geometry';
// import { SpatialReference } from 'esri/geometry';
// import { Geometry } from 'esri/geometry';

import { MapLinkrApp } from './app.component';
import { MapsPage } from '../pages/maps/map.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';// Custom components
import { SideMenuContentComponent } from '../side-menu-content/side-menu-content.component';

import { PlacesSearchComponent } from '../pages/mlcomponents/PlacesSearch/places.component';
import { PositionViewComponent } from '../pages/mlcomponents/PositionView/PositionView.component';
import { MsgsetupComponent } from '../components/msgsetup/msgsetup';
import { EsriMapComponent } from '../pages/mlcomponents/EsriMap/esrimap.component';
import { GoogleMapComponent } from '../pages/mlcomponents/GoogleMap/googlemap.component';
import { LeafletMapComponent } from '../pages/mlcomponents/LeafletMap/leafletmap.component';
import { ESRIMapService } from '../services/esrimap.service';
import { MultiCanvasEsri } from '../pages/mlcomponents/MultiCanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../pages/mlcomponents/MultiCanvas/multicanvasgoogle.component';
import { MultiCanvasLeaflet } from '../pages/mlcomponents/MultiCanvas/multicanvasleaflet.component';

// import { CoordinateComponent } from '../pages/mlcomponents/coordinate/coordinate.component';
import { CarouselComponent } from '../pages/mlcomponents/Carousel/carousel.component';
import { DomService } from '../services/dom.service';
import { MapInstanceService } from '../services/MapInstanceService';
import { CanvasService } from '../services/CanvasService';
import { SlideShareService } from '../services/slideshare.service';
import { SlideViewService } from '../services/slideview.service';
import { PositionUpdateService } from '../services/positionupdate.service';
import { PusherClientService } from '../services/pusherclient.service';
import { PageService } from '../services/pageservice';
import { PusherConfig } from '../pages/mlcomponents/libs/PusherConfig';
import { PusherEventHandler } from '../pages/mlcomponents/libs/PusherEventHandler';
import { HostConfig } from '../pages/mlcomponents/libs/HostConfig';
import { utils } from '../pages/mlcomponents/libs/utils';
import { CurrentMapTypeService } from '../services/currentmaptypeservice';
import { GeoCodingService } from '../services/GeoCodingService';
import { GeoPusherSupport } from '../pages/mlcomponents/libs/geopushersupport';
import { NewsComponent } from '../components/news/news';
import { LocateselfComponent } from '../components/locateself/locateself';
import { PushersetupComponent } from '../components/pushersetup/pushersetup';
import { AgogroupComponent } from '../components/agogroup/agogroup';
import { AgoitemComponent } from '../components/agoitem/agoitem';
import { DestselectionComponent } from '../components/destselection/destselection';
import { DestinationsProvider } from '../providers/destinations/destinations';
// import { MaplocoptsProvider } from '../providers/maplocopts/maplocopts';
import { MapopenerProvider } from '../providers/mapopener/mapopener';
import { HiddenmapComponent } from '../components/hiddenmap/hiddenmap';
import { AgoqueryProvider } from '../providers/agoquery/agoquery';
import { SharemapComponent } from '../components/sharemap/sharemap'
import { SharemapProvider } from '../providers/sharemap/sharemap';
import { InfopopupComponent } from '../components/infopopup/infopopup';
import { AgodetailComponent } from '../components/agodetail/agodetail';
import { SearchplacesProvider } from '../providers/searchplaces/searchplaces';
import { EmailerProvider } from '../providers/emailer/emailer';
import { AccordionListComponent } from '../components/accordion-list/accordion-list';
import { GmpopoverProvider } from '../providers/gmpopover/gmpopover';
import { GmpopoverComponent } from '../components/gmpopover/gmpopover';
import { PophandlerProvider } from '../providers/pophandler/pophandler';
import { InfopopProvider } from '../providers/infopop/infopop';
import { InfopopComponent} from '../components/infopop/infopop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Startup } from '../pages/mlcomponents/libs/Startup';
// import { StartupGoogle } from '../pages/mlcomponents/libs/StartupGoogle';
// import { MapHoster } from '../pages/mlcomponents/libs/MapHoster';
// import { MapHosterGoogle } from '../pages/mlcomponents/libs/MapHosterGoogle';

@NgModule({
  declarations: [
    MapLinkrApp,
    MapsPage,
    SideMenuContentComponent,
    PlacesSearchComponent,
    PositionViewComponent,
    EsriMapComponent,
    GoogleMapComponent,
    LeafletMapComponent,
    MultiCanvasEsri,
    MultiCanvasGoogle,
    MultiCanvasLeaflet,
    CarouselComponent,
    NewsComponent,
    LocateselfComponent,
    PushersetupComponent,
    AgogroupComponent,
    AgoitemComponent,
    DestselectionComponent,
    HiddenmapComponent,
    SharemapComponent,
    InfopopupComponent,
    AgodetailComponent,
    MsgsetupComponent,
    AccordionListComponent,
    GmpopoverComponent,
    InfopopComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MapLinkrApp),
    NgbModule.forRoot(),
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule
    // HttpHandler,
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
    LeafletMapComponent,
    PositionViewComponent,
    NewsComponent,
    LocateselfComponent,
    PushersetupComponent,
    AgogroupComponent,
    AgoitemComponent,
    DestselectionComponent,
    HiddenmapComponent,
    SharemapComponent,
    InfopopupComponent,
    AgodetailComponent,
    MsgsetupComponent,
    AccordionListComponent,
    GmpopoverComponent,
    InfopopComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ESRIMapService,
    CanvasService,
    MapInstanceService,
    CurrentMapTypeService,
    GeoCodingService,
    SlideShareService,
    SlideViewService,
    PositionUpdateService,
    PageService,
    PusherConfig,
    PusherClientService,
    PusherEventHandler,
    HostConfig,
    utils,
    GeoPusherSupport,
    HttpClient,
    HttpClientModule,
    // HttpHandler,
    // Startup,
    // StartupGoogle,
    // MapHoster,
    // MapHosterGoogle,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DestinationsProvider,
    // MaplocoptsProvider,
    MapopenerProvider,
    AgoqueryProvider,
    DomService,
    SharemapProvider,
    SearchplacesProvider,
    EmailerProvider,
    GmpopoverProvider,
    PophandlerProvider,
    InfopopProvider
  ]
})
export class AppModule {}
