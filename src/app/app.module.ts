import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// import { MapView } from 'esri/views/MapView';
// import { Point } from 'esri/geometry/Point';
// import { SpatialReference } from 'esri/geometry/SpatialReference';

import { MapLinkrApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MapsPage } from '../pages/maps/maps';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MapLinkrApp,
    HomePage,
    ListPage,
    MapsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MapLinkrApp),
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
