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
  private items : any;
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

  checkEnter(e){ //e is event object passed from function invocation
    var characterCode; //literal character code will be stored in this variable

    if(e && e.which){ //if which property of event object is supported (NN4)
      e = e
      characterCode = e.which; //character code is contained in NN4's which property
    }
    else{
      e = event
      characterCode = e.keyCode; //character code is contained in IE's keyCode property
    }

    if(characterCode == 13){ //if generated character code is equal to ascii 13 (if enter key)
      this.itemFinderSubmit(); //submit the form
      return false;
    }
    else{
      return true;
    }
  }

  async itemFinderSubmit() {
      let itm = this.agoitemgroup.getRawValue();
      let searchRes = await this.agoqp.findArcGISItem(itm.searchTermItem);
      console.log(searchRes);
      this.agoItems = searchRes;
      // this.agoItems = searchRes.toArray();
/*          data => {
            let d : any = data;
            this.agoItems = d.results;
          },
          err => console.error(err),
          // the third argument is a function which runs on completion
          () => console.log('done loading items')
        );
*/
      console.log(this.agoItems);
  }
  selectAgoItem(itm) {
      console.log(`selected map item ${itm.title}`);
      this.selectedItem = itm;
      let agodtl = this.modalCtrl.create(AgodetailComponent, {title : itm.title, snippet : itm.snippet, thumbnailUrl : itm.thumbnailUrl});
      agodtl.onDidDismiss(data => {
        data.selected == true ? this.accept() : this.logForm();
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
