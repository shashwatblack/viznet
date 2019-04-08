import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { VizRoutingModule } from './viz-routing.module';
import { VizComponent } from './viz.component';
import { D3SandboxComponent } from './d3-sandbox/d3-sandbox.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CnnModelComponent } from '@app/viz/cnn-model/cnn-model.component';
import { ModuleImageComponent } from '@app/viz/module-image/module-image.component';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  imports: [CommonModule, TranslateModule, VizRoutingModule, NgbModule, FormsModule, Ng5SliderModule],
  declarations: [VizComponent, D3SandboxComponent, InfoWindowComponent, CnnModelComponent, ModuleImageComponent]
})
export class VizModule {}
