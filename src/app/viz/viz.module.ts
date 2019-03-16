import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { VizRoutingModule } from './viz-routing.module';
import { VizComponent } from './viz.component';
import { D3SandboxComponent } from './d3-sandbox/d3-sandbox.component';

@NgModule({
  imports: [CommonModule, TranslateModule, VizRoutingModule],
  declarations: [VizComponent, D3SandboxComponent]
})
export class VizModule {}
