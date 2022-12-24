import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumidoresRoutingModule } from './consumidores-routing.module';
import { ConsumidorDetalleComponent } from './components/consumidor-detalle/consumidor-detalle.component';


@NgModule({
  declarations: [
    ConsumidorDetalleComponent
  ],
  imports: [
    CommonModule,
    ConsumidoresRoutingModule
  ]
})
export class ConsumidoresModule { }
