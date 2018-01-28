import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';

// import { MapView } from 'esri/views/MapView';
// import { Point } from 'esri/geometry/Point';
// import { SpatialReference } from 'esri/geometry/SpatialReference';

import { MapLinkrApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MapsPage } from '../pages/maps/maps';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';// Custom components
import { SideMenuContentComponent } from '../side-menu-content/side-menu-content.component';

@NgModule({
  declarations: [
    MapLinkrApp,
    HomePage,
    ListPage,
    MapsPage,
    SideMenuContentComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MapLinkrApp),
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
    HomePage,
    ListPage,
    MapsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
