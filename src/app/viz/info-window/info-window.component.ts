import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
  // encapsulation: ViewEncapsulation.Native,
})
export class InfoWindowComponent implements OnInit {
  @Input('node') node: any;

  constructor() {}

  ngOnInit() {
    console.log('hey yo', this.node);
  }
}
