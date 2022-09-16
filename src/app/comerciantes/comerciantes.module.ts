import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComerciantesRoutingModule } from './comerciantes-routing.module';
import { NegocioDetalleComponent } from './components/negocio-detalle/negocio-detalle.component';
import { ComercianteDetalleComponent } from './components/comerciante-detalle/comerciante-detalle.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [NegocioDetalleComponent, ComercianteDetalleComponent],
  imports: [CommonModule, ComerciantesRoutingModule, SharedModule],
})
export class ComerciantesModule {}
