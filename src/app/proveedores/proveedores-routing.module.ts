import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedorDetalleComponent } from './components/proveedor-detalle/proveedor-detalle.component';

const routes: Routes = [
  { path:"detalle/:id", component:ProveedorDetalleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
