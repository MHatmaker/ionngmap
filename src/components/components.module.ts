import { NgModule } from '@angular/core';
import { PushersetupComponent } from './pushersetup/pushersetup';
import { NewsComponent } from './news/news';
@NgModule({
	declarations: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent],
	imports: [],
	exports: [PushersetupComponent,
    NewsComponent,
    PushersetupComponent]
})
export class ComponentsModule {}
