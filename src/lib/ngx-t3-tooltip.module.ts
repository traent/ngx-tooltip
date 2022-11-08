import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxT3TooltipComponent } from './ngx-t3-tooltip.component';
import { NgxT3TooltipDirective } from './ngx-t3-tooltip.directive';

@NgModule({
  imports: [
    CommonModule,
    ObserversModule,
  ],
  declarations: [
    NgxT3TooltipComponent,
    NgxT3TooltipDirective,
  ],
  exports: [
    NgxT3TooltipComponent,
    NgxT3TooltipDirective,
  ],
})
export class NgxT3TooltipModule { }
