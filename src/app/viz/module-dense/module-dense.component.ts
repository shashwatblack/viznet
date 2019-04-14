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

  public introSteps = {
    current_index: 0
  };

  toggleStep(step) {
    if (this.introSteps.current_index == step) {
      this.introSteps.current_index = -1;
    } else {
      this.introSteps.current_index = step;
    }
  }
}
