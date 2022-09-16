import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportadoresRoutingModule } from './transportadores-routing.module';
import { TransportadorDetalleComponent } from './components/transportador-detalle/transportador-detalle.component';
import { VehiculoDetalleComponent } from './components/vehiculo-detalle/vehiculo-detalle.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [VehiculoDetalleComponent, TransportadorDetalleComponent],
  imports: [CommonModule, TransportadoresRoutingModule, SharedModule],
})
export class TransportadoresModule {}
