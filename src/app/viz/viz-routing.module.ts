import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { VizComponent } from './viz.component';

const routes: Routes = [Shell.childRoutes([{ path: 'viz', component: VizComponent, data: { title: extract('Viz') } }])];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class VizRoutingModule {}
