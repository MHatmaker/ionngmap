import { Component } from '@angular/core';
import { SharemapProvider } from '../../providers/sharemap/sharemap';

@Component({
  selector: 'sharemap',
  templateUrl: 'sharemap.html'
})
export class SharemapComponent {

  text: string;

  constructor(private sharemapProvider : SharemapProvider) {
    this.text = 'Share with other maps';
  }

  shareInfo() {
    this.sharemapProvider.shareInfo();
  }

}
