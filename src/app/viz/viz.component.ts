import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/core';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.scss']
})
export class VizComponent implements OnInit {
  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit() {}

  networkStateNext() {
    this.notificationService.info('Yet to implement!!!');
  }
}
