import { Component, ViewChild } from '@angular/core';
import { Platform , MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController, NavParams } from 'ionic-angular';

import { MapsPage } from '../pages/maps/map.component';
// Side Menu Component
import { SideMenuContentComponent } from './../side-menu-content/side-menu-content.component';
import { SideMenuSettings } from './../side-menu-content/models/side-menu-settings';
import { PageService } from './../services/pageservice';
import { MenuOptionModel } from './../side-menu-content/models/menu-option-model';

@Component({
  templateUrl: 'app.html'
})
export class MapLinkrApp {
  @ViewChild('mlcontent') nav: NavController // <--- Reference to the Nav
	// Get the instance to call the public methods
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;
  // Options to show in the SideMenuComponent
	public options: Array<MenuOptionModel>;
  rootPage = MapsPage;

	// Settings for the SideMenuComponent
	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: true,
		selectedOptionClass: 'active-side-menu-option',
		subOptionIndentation: {
			md: '56px',
			ios: '64px',
			wp: '56px'
		}
	};
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
      private menuCtrl: MenuController, private pageService : PageService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Maps', component: MapsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Initialize some options
			this.initializeOptions();
    });
  }
/*
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page.component);
  }
*/
	private initializeOptions(): void {
		this.options = new Array<MenuOptionModel>();

		this.options.push({
			iconName: 'link',
			displayName: 'Map options',
			subItems: [
				{
					iconName: 'logo-google',
					displayName: 'google',
					component: MapsPage
				},
				{
					iconName: 'globe',
					displayName: 'esri',
					component: MapsPage
				},
				{
					iconName: 'leaf',
					displayName: 'leaflet',
					component: MapsPage
				}
			]
		});
/*
		// Load special options
		// -----------------------------------------------
		this.options.push({
			displayName: 'Special options',
			subItems: [
				{
					iconName: 'log-in',
					displayName: 'Login',
					custom: {
						isLogin: true
					}
				},
				{
					iconName: 'log-out',
					displayName: 'Logout',
					custom: {
						isLogout: true
					}
				},
				{
					iconName: 'globe',
					displayName: 'Open Google',
					custom: {
						isExternalLink: true,
						externalUrl: 'http://www.google.com'
					}
				}
			]
		});*/
	}

	public selectOption(option: MenuOptionModel): void {
		this.menuCtrl.close().then(() => {
      this.pageService.menuOption.emit(option)
			// if (option.custom && option.custom.isLogin) {
			// 	this.presentAlert('You\'ve clicked the login option!');
			// } else if (option.custom && option.custom.isLogout) {
			// 	this.presentAlert('You\'ve clicked the logout option!');
			// } else if (option.custom && option.custom.isExternalLink) {
			// 	let url = option.custom.externalUrl;
			// 	window.open(url, '_blank');
			// } else {

				// Redirect to the selected page
				// this.navCtrl.setRoot(option.component || MapsPage, { 'title': option.displayName });
        // this.rootPage = option.component;
			// }
		});
	}

	public collapseMenuOptions(): void {
		this.sideMenu.collapseAllOptions();
	}
}
