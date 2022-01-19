import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipoTrabajoRoutingModule } from './equipo-trabajo-routing.module';
import { EquipoTrabajoComponent } from './components/equipo-trabajo/equipo-trabajo.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    EquipoTrabajoComponent
  ],
  imports: [
    CommonModule,
    EquipoTrabajoRoutingModule,
    SharedModule
  ]
})
export class EquipoTrabajoModule { }
