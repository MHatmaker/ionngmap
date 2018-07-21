import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the AgodetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'agodetail',
  templateUrl: 'agodetail.html'
})
export class AgodetailComponent {

  text: string;

  constructor(private detailInfo : NavParams, private modalCtrl : ModalController, private viewCtrl : ViewController ) {
    console.log('Hello AgodetailComponent Component');
    this.text = detailInfo.get('title');
  }
  cancelSelectedItem() {
    let data = {'selected' : false};
    this.viewCtrl.dismiss(data );
  }
  loadMapForItem() {
    let data = {'selected' : true};
    this.viewCtrl.dismiss(data);
  }

}
