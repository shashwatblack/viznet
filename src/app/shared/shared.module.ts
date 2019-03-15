import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent, MatSnackBarModule]
})
export class SharedModule {}
