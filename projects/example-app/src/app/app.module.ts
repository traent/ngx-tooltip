import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxT3TooltipModule } from '@traent/ngx-tooltip';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxT3TooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
