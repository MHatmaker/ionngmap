import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
// import { SharemapProvider } from '../../providers/sharemap/sharemap';
// import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'infopopup',
  templateUrl: 'infopopup.html'
})
export class InfopopupComponent {

  itemContent: string;

  constructor(info : NavParams) {
    console.log('Hello InfopopupComponent Component');
    alert(info.get('address'));
    this.itemContent = info.get('address');
    // this.itemContent = this.sharemapInfo.getInfo();
  }

}
