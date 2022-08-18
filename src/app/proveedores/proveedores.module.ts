import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedorDetalleComponent } from './components/proveedor-detalle/proveedor-detalle.component';


@NgModule({
  declarations: [
    ProveedorDetalleComponent
  ],
  imports: [
    CommonModule,
    ProveedoresRoutingModule
  ]
})
export class ProveedoresModule { }
