import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { VizComponent } from './viz.component';
import { ModuleImageComponent } from '@app/viz/module-image/module-image.component';
import { ModuleConvComponent } from '@app/viz/module-conv/module-conv.component';
import { ModuleDenseComponent } from '@app/viz/module-dense/module-dense.component';
import { ModulePoolComponent } from '@app/viz/module-pool/module-pool.component';
import { ModuleResourcesComponent } from '@app/viz/module-resources/module-resources.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'module_cnn',
      component: VizComponent,
      data: {
        title: extract(`What's a CNN?`)
      }
    },
    {
      path: 'module_image',
      component: ModuleImageComponent,
      data: {
        title: extract(`What is an Image?`)
      }
    },
    {
      path: 'module_conv',
      component: ModuleConvComponent,
      data: {
        title: extract(`What is Convolution?`)
      }
    },
    {
      path: 'module_pool',
      component: ModulePoolComponent,
      data: {
        title: extract(`What is Pooling?`)
      }
    },
    {
      path: 'module_dense',
      component: ModuleDenseComponent,
      data: {
        title: extract(`What is a Perceptron?`)
      }
    },
    {
      path: 'module_resources',
      component: ModuleResourcesComponent,
      data: {
        title: extract(`Additional Resources!`)
      }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class VizRoutingModule {}
