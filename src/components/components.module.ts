import { NgModule } from '@angular/core';
import { PushersetupComponent } from './pushersetup/pushersetup';
import { NewsComponent } from './news/news';
import { DestselectionComponent } from './destselection/destselection';
import { HiddenmapComponent } from './hiddenmap/hiddenmap';
import { AgogroupComponent } from './agogroup/agogroup';
import { AgoitemComponent } from './agoitem/agoitem';
import { SharemapComponent } from './sharemap/sharemap';
@NgModule({
	declarations: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent,
    HiddenmapComponent,
    AgogroupComponent,
    AgoitemComponent,
    SharemapComponent],
	imports: [],
	exports: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent,
    HiddenmapComponent,
    AgogroupComponent,
    AgoitemComponent,
    SharemapComponent]
})
export class ComponentsModule {}
