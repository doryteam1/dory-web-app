import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestigadoresRoutingModule } from './investigadores-routing.module';
import { InvestigadorDetalleComponent } from './components/investigador-detalle/investigador-detalle.component';


@NgModule({
  declarations: [
    InvestigadorDetalleComponent
  ],
  imports: [
    CommonModule,
    InvestigadoresRoutingModule
  ]
})
export class InvestigadoresModule { }
