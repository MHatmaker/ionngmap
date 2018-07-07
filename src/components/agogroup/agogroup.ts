import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgoqueryProvider } from '../../providers/agoquery/agoquery';

@Component({
  selector: 'agogroup',
  templateUrl: 'agogroup.html'
})
export class AgogroupComponent {

  searchTermGrp: string;
  private agogroupgroup : FormGroup;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder,
    private agoqp : AgoqueryProvider) {
    console.log('Hello AgogroupComponent Component');
    this.searchTermGrp = 'search terms';
    this.agogroupgroup = this.formBuilder.group({
      searchTermGrp: 'search terms'
    });
  }
  async groupFinderSubmit() {
      let grp = this.agogroupgroup.getRawValue();
      let res = await this.agoqp.findArcGISGroup(grp.searchTermGrp);

      console.log(res);
  }
  accept() {
      this.viewCtrl.dismiss();
  }
  logForm(){
    console.log(this.agogroupgroup.value)
  }
  cancel() {
      this.viewCtrl.dismiss();
  }
}
