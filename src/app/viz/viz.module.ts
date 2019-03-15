import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { VizRoutingModule } from './viz-routing.module';
import { VizComponent } from './viz.component';

@NgModule({
  imports: [CommonModule, TranslateModule, VizRoutingModule],
  declarations: [VizComponent]
})
export class VizModule {}
