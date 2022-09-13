import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculosRoutingModule } from './vehiculos-routing.module';
import { GalleryModule } from 'ng-gallery';
import { VehiculoDetalleComponent } from './components/vehiculo-detalle/vehiculo-detalle.component';


@NgModule({
  declarations: [VehiculoDetalleComponent],
  imports: [
    CommonModule,
    VehiculosRoutingModule,
    GalleryModule
  ]
})
export class VehiculosModule { }
