import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { ProveedorDetalleComponent } from './components/proveedor-detalle/proveedor-detalle.component';

const routes: Routes = [
  { path:"detalle/:id", component:ProveedorDetalleComponent},
  { path:"producto/detalle/:id",component:ProductoDetalleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
