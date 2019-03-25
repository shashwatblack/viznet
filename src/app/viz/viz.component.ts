import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@app/core';
import { D3SandboxComponent } from '@app/viz/d3-sandbox/d3-sandbox.component';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.scss']
})
export class VizComponent implements OnInit {
  @ViewChild('d3_sandbox') d3_sandbox: D3SandboxComponent;
  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit() {}

  networkStateNext() {
    this.notificationService.info('Yet to implement!!!');
    this.d3_sandbox.rotateImage();
  }
}
