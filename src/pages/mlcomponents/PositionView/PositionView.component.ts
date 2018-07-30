import { Component } from '@angular/core';
// import { utils } from '../libs/utils';
import { PusherConfig } from '../libs/PusherConfig';
// import { CurrentMapTypeService } from '../../../services/currentmaptypeservice';
import { IPositionData, IPositionParams } from '../../../services/positionupdate.interface'
import { PositionUpdateService } from '../../../services/positionupdate.service';

console.log('PositionViewCtrl setup');

interface IViewOption  {
    type : string;
    key : string;
    value : string
};

@Component({
  selector: 'position-view',
  templateUrl: './positionview.component.html',
  styles: [ './positionview.component.scss']
})
export class PositionViewComponent  {
    private currentTab : string;
    private currentViewOption : IViewOption;
    public positionView : string;
    private expBtnHeight : number;
    public selectedOption : string;
    public selectOptions : any;
    public curDetails = {
        zm : 'zm',
        scl : 'scl',
        cntrlng : 'cntrlng',
        cntrlat : 'cntrlat',
        evlng : 'evlng',
        evlat : 'evlat'
    };
    private updateDetails = {
        'zm' :  (opt) => {this.curDetails.zm = opt.zm; this.curDetails.scl = opt.scl;},
        'cntr' : (opt) => {this.curDetails.cntrlng = opt.cntrlng; this.curDetails.cntrlat = opt.cntrlat;},
        'coords' : (opt) => {this.curDetails.evlng = opt.evlng; this.curDetails.evlat = opt.evlat;}
    };
    private formatView = {
        'zm' : (zlevel) =>  {
            var formatted = "Zoom : " + zlevel.zm + " Scale : " + zlevel.scl;
            this.positionView = formatted;
        },
        'cntr' : (cntr) => {
            var formatted  = cntr.cntrlng + ', ' + cntr.cntrlat;
            this.positionView = formatted;
        },
        'coords' : (evnt) => {
            var formatted  = evnt.evlng + ', ' + evnt.evlat;
            // console.log("old : " + this.positionView + " new " + formatted);
            this.positionView = formatted;
        }
    };
    private self : any;

    public viewOptions : IViewOption[] = [
        {
            type : 'zoom level',
            key : 'zm',
            value : 'zm, scale'
        },
        {
            type : 'map center',
            key : 'cntr',
            value : 'cntrlng, cntrlat'
        },
        {
            type : 'mouse coords',
            key : 'coords',
            value : 'evlng, evlat'
        }
    ];

    constructor(pusherConfig : PusherConfig, private positionUpdateService : PositionUpdateService) {
        console.debug('PositionViewCtrl - initialize dropdown for position selections');
        // let serv = new CurrentMapTypeService();
        // this.currentTab = serv.getMapTypeKey();
        this.self = this;

        this.positionUpdateService.positionData.subscribe(
          (data: IPositionData) => {
            // console.log(data);
            this.updatePosition(data.key, data.val);
          });

        this.currentViewOption = this.viewOptions[2];
        this.selectedOption = this.viewOptions[2].key;
        this.selectOptions = {
          mode : 'Popover'
        }
        this.positionView = "position info";
        this.expBtnHeight = 1.2; // utils.getButtonHeight(1.5); //'verbageExpandCollapseImgId');
    }

    fmtView() {
        this.formatView[this.currentViewOption.key](this.curDetails);
    }

    setPostionDisplayType () {
        //alert("changed " + this.selectedOption.value);
        // this.positionView = this.selectedOption.value;
        console.log("setPostionDisplayType : " + this.currentViewOption.key);
        var curKey = this.currentViewOption.key;
        this.formatView[curKey](this.curDetails);
    };

    updatePosition (key : string, val : IPositionParams) {
        // console.log("in updatePosition");
        if (key === 'zm' || key === 'cntr') {
            this.updateDetails.zm(val);
            this.updateDetails.cntr(val);
        } else {
              this.updateDetails[key](val);
        }
        if (key === this.currentViewOption.key) {
            this.fmtView();
            // console.log("calling $apply()");
            // this.safeApply(this.fmtView); // this.formatView[key](val));
            //angular.element("mppos").scope().$apply();
        }
    };

}
