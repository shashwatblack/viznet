import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { VizRoutingModule } from './viz-routing.module';
import { VizComponent } from './viz.component';
import { D3SandboxComponent } from './d3-sandbox/d3-sandbox.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CnnModelComponent } from '@app/viz/d3-sandbox/cnn-model.component';

@NgModule({
  imports: [CommonModule, TranslateModule, VizRoutingModule, NgbModule],
  declarations: [VizComponent, D3SandboxComponent, InfoWindowComponent, CnnModelComponent]
})
export class VizModule {}
