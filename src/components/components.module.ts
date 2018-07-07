import { NgModule } from '@angular/core';
import { PushersetupComponent } from './pushersetup/pushersetup';
import { NewsComponent } from './news/news';
import { DestselectionComponent } from './destselection/destselection';
import { HiddenmapComponent } from './hiddenmap/hiddenmap';
import { AgogroupComponent } from './agogroup/agogroup';
@NgModule({
	declarations: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent,
    HiddenmapComponent,
    AgogroupComponent],
	imports: [],
	exports: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent,
    HiddenmapComponent,
    AgogroupComponent]
})
export class ComponentsModule {}
