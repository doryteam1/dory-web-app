import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovedadesRoutingModule } from './novedades-routing.module';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { ShorterPipe } from '../pipes/shorter.pipe';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    NovedadesComponent,
    ShorterPipe
  ],
  imports: [
    CommonModule,
    NovedadesRoutingModule,
    SharedModule
  ]
})
export class NovedadesModule { }
