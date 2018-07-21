import { NgModule } from '@angular/core';
import { PushersetupComponent } from './pushersetup/pushersetup';
import { NewsComponent } from './news/news';
import { DestselectionComponent } from './destselection/destselection';
import { HiddenmapComponent } from './hiddenmap/hiddenmap';
import { AgogroupComponent } from './agogroup/agogroup';
import { AgoitemComponent } from './agoitem/agoitem';
import { SharemapComponent } from './sharemap/sharemap';
import { InfopopupComponent } from './infopopup/infopopup';
import { AgodetailComponent } from './agodetail/agodetail';
@NgModule({
	declarations: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent,
    HiddenmapComponent,
    AgogroupComponent,
    AgoitemComponent,
    SharemapComponent,
    InfopopupComponent,
    AgodetailComponent],
	imports: [],
	exports: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent,
    HiddenmapComponent,
    AgogroupComponent,
    AgoitemComponent,
    SharemapComponent,
    InfopopupComponent,
    AgodetailComponent]
})
export class ComponentsModule {}
