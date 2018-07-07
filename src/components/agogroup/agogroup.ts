import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgoqueryProvider, AgoGroupItem, IAgoGroupItem } from '../../providers/agoquery/agoquery';
import { Observable } from 'rxjs';

@Component({
  selector: 'agogroup',
  templateUrl: 'agogroup.html'
})
export class AgogroupComponent {

  searchTermGrp: string;
  private agogroupgroup : FormGroup;
  private agoGroups : any;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder,
    private agoqp : AgoqueryProvider) {
    console.log('Hello AgogroupComponent Component');
    this.searchTermGrp = 'search terms';
    this.agogroupgroup = this.formBuilder.group({
      searchTermGrp: 'search terms',
      agoGroups : Array<AgoGroupItem[]>()
    });
  }
  async groupFinderSubmit() {
      let grp = this.agogroupgroup.getRawValue();
      this.agoGroups = await this.agoqp.findArcGISGroup(grp.searchTermGrp);

      console.log(this.agoGroups);
  }
  selectAgoItem(itm) {
      console.log(itm.title);
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
