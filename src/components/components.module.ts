import { NgModule } from '@angular/core';
import { PushersetupComponent } from './pushersetup/pushersetup';
import { MaplinkrpluginComponent } from './maplinkrplugin/maplinkrplugin';
import { NewsComponent } from './news/news';
@NgModule({
	declarations: [PushersetupComponent,
    MaplinkrpluginComponent,
    NewsComponent],
	imports: [],
	exports: [PushersetupComponent,
    MaplinkrpluginComponent,
    NewsComponent]
})
export class ComponentsModule {}
