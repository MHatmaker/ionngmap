import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgoqueryProvider, AgoItem, IAgoItem } from '../../providers/agoquery/agoquery';

@Component({
  selector: 'agoitem',
  templateUrl: 'agoitem.html'
})
export class AgoitemComponent {

  searchTermItem: string;
  private agoitemgroup : FormGroup;
  private agoItems : any;

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder,
    private agoqp : AgoqueryProvider) {
    console.log('Hello AgoItemComponent Component');
    this.searchTermItem = 'search terms';
    this.agoitemgroup = this.formBuilder.group({
      searchTermItem: 'search terms',
      agoItems : Array<AgoItem[]>()
    });
  }
  async itemFinderSubmit() {
      let itm = this.agoitemgroup.getRawValue();
      this.agoItems = await this.agoqp.findArcGISItem(itm.searchTermItem);

      console.log(this.agoItems);
  }
  selectAgoItem(itm) {
      console.log(itm.title);
  }
  accept() {
      this.viewCtrl.dismiss();
  }
  logForm(){
    console.log(this.agoitemgroup.value)
  }
  cancel() {
      this.viewCtrl.dismiss();
  }

}
