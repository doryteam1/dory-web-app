import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovedadesRoutingModule } from './novedades-routing.module';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@NgModule({
  declarations: [
    NovedadesComponent,
  ],
  imports: [
    CommonModule,
    NovedadesRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    ShareButtonsModule,
    ShareIconsModule
  ]
})
export class NovedadesModule { }
