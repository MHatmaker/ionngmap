import { Component, ViewChild } from '@angular/core';
import { Platform , MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController } from 'ionic-angular';

import { MapsPage } from '../pages/maps/map.component';
// Side Menu Component
import { SideMenuContentComponent } from './../side-menu-content/side-menu-content.component';
import { SideMenuSettings } from './../side-menu-content/models/side-menu-settings';
import { PageService } from './../services/pageservice';
import { MenuOptionModel } from './../side-menu-content/models/menu-option-model';
import { PusherConfig } from '../pages/mlcomponents/libs/PusherConfig';
import { HostConfig } from '../pages/mlcomponents/libs/HostConfig';
// import { Geolocation } from '@ionic-native/geolocation';

@Component({
  templateUrl: 'app.html',
  // styleUrls : ['src/app.css']
  styles : [".custom-icon {src: '../assets/icon/map-w-marker-icon.png'}"]
  // background-image: url("https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/checkmark-24-24.png");

})
export class MapLinkrApp {
  @ViewChild('mlcontent') nav: NavController // <--- Reference to the Nav
	// Get the instance to call the public methods
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;
  // Options to show in the SideMenuComponent
	public options: Array<MenuOptionModel>;
  public channel: any;
  private userName : string;
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
      private menuCtrl: MenuController, private pageService : PageService,
      private pusherConfig : PusherConfig, hostConfig : HostConfig) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Maps', component: MapsPage }
    ];

    console.log('HostConfig initialization');
    hostConfig.showConfig('MapLinkr App startup before modifying default settings and dojodomReady');

    hostConfig.setLocationPath(location.origin + location.pathname);
    console.log("location.search");
    console.log(location.search);
    hostConfig.setSearch(location.search);
    pusherConfig.setSearch(location.search);
    hostConfig.setprotocol(location.protocol);
    hostConfig.sethost(location.host);
    hostConfig.sethostport(location.port);
    hostConfig.sethref(location.href);

    if (location.search === '') {
        hostConfig.setInitialUserStatus(true);
        hostConfig.setReferrerId('-99');
    } else {
        hostConfig.setInitialUserStatus(false);
        this.channel = pusherConfig.getChannelFromUrl();
        if (this.channel !== '') {
            pusherConfig.setChannel(this.channel);
            pusherConfig.setNameChannelAccepted(true);
        }
        this.userName = hostConfig.getUserNameFromUrl();
        if (this.userName !== '') {
            pusherConfig.setUserName(this.userName);
        }
        // hostConfig.setStartupView(true, false);
        console.log("hostConfig.SETSTARTUPVIEW to sumvis true, sitevis false");
    }
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
					iconName: 'custom-icon',
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
		this.options.push({
			iconName: 'link',
			displayName: 'MapLinkr',
      component: MapsPage
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
