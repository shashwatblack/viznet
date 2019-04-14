import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UtilsService } from '@app/core';

@Component({
  selector: 'app-module-dense',
  templateUrl: './module-dense.component.html',
  styleUrls: ['./module-dense.component.scss']
})
export class ModuleDenseComponent implements OnInit {
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
