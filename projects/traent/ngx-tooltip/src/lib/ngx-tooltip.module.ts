import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxT3TooltipComponent } from './ngx-tooltip.component';
import { NgxT3TooltipDirective } from './ngx-tooltip.directive';

@NgModule({
  imports: [
    CommonModule,
    ObserversModule,
    OverlayModule,
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
