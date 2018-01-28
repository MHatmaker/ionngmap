import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html'
})
export class MapsPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['google', 'arcgis', 'leaflet'];

    this.items = [];
    // for (let i = 1; i < this.icons.length; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');
  }
  openPage(p) {
      console.log("selected map type " + p);
  }
}
