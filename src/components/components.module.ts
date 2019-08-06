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
import { MsgsetupComponent } from './msgsetup/msgsetup';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { GmpopoverComponent } from './gmpopover/gmpopover';
import { InfopopComponent } from './infopop/infopop';
import { LocateselfComponent } from './locateself/locateself';
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
    AgodetailComponent,
    MsgsetupComponent,
    AccordionListComponent,
    GmpopoverComponent,
    InfopopComponent,
    LocateselfComponent],
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
    AgodetailComponent,
    MsgsetupComponent,
    AccordionListComponent,
    GmpopoverComponent,
    InfopopComponent,
    LocateselfComponent]
})
export class ComponentsModule {}
