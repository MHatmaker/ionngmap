import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgoqueryProvider, AgoItem, IAgoItem } from '../../providers/agoquery/agoquery';
import { AgodetailComponent } from '../agodetail/agodetail';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'agoitem',
  templateUrl: 'agoitem.html'
})
export class AgoitemComponent {

  searchTermItem: string;
  private agoitemgroup : FormGroup;
  private agoItems : any;
  private selectedItem : string = "";

  constructor(public viewCtrl: ViewController, private formBuilder : FormBuilder,
    private agoqp : AgoqueryProvider, private modalCtrl : ModalController) {
    console.log('Hello AgoItemComponent Component');
    this.searchTermItem = 'Chicago Crime';
    this.agoitemgroup = this.formBuilder.group({
      searchTermItem: 'Chicago Crime',
      agoItems : Array<AgoItem[]>()
    });
  }
  async itemFinderSubmit() {
      let itm = this.agoitemgroup.getRawValue();
      this.agoItems = await this.agoqp.findArcGISItem(itm.searchTermItem);

      console.log(this.agoItems);
  }
  selectAgoItem(itm) {
      console.log(`selected map item ${itm.title}`);
      this.selectedItem = itm;
      let agodtl = this.modalCtrl.create(AgodetailComponent, {title : itm.title});
      agodtl.onDidDismiss(data => {
        data.selected == true ? this.accept() : this.cancel();
      });
      agodtl.present();
  }
  accept() {
      this.viewCtrl.dismiss(this.selectedItem);
  }
  logForm(){
    console.log(this.agoitemgroup.value)
  }
  cancel() {
      // this.viewCtrl.dismiss();
      console.log("agoitem got cancel from agodetail");
      this.viewCtrl.dismiss("cancelled");
  }

}
