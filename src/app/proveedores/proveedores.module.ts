import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedorDetalleComponent } from './components/proveedor-detalle/proveedor-detalle.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ProveedorDetalleComponent, ProductoDetalleComponent],
  imports: [CommonModule, ProveedoresRoutingModule, SharedModule],
})
export class ProveedoresModule {}
