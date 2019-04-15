import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UtilsService } from '@app/core';

@Component({
  selector: 'app-module-resources',
  templateUrl: './module-resources.component.html',
  styleUrls: ['./module-resources.component.scss']
})
export class ModuleResourcesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  public minimizedSteps: Array<any> = [];

  toggleStep(step) {
    let index = this.minimizedSteps.indexOf(step);
    if (index > -1) {
      this.minimizedSteps.splice(index, 1);
    } else {
      this.minimizedSteps.push(step);
    }
  }
}
