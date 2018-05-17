import { NgModule } from '@angular/core';
import { PushersetupComponent } from './pushersetup/pushersetup';
import { NewsComponent } from './news/news';
import { DestselectionComponent } from './destselection/destselection';
@NgModule({
	declarations: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent],
	imports: [],
	exports: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent,
    DestselectionComponent]
})
export class ComponentsModule {}
