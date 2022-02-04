import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovedadesRoutingModule } from './novedades-routing.module';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { ShorterPipe } from '../pipes/shorter.pipe';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    NovedadesComponent,
    ShorterPipe
  ],
  imports: [
    CommonModule,
    NovedadesRoutingModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class NovedadesModule { }
