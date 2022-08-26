import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiculoDetalleComponent } from './components/vehiculo-detalle/vehiculo-detalle.component';

const routes: Routes = [
  {
    path:'detalle/:id', component:VehiculoDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiculosRoutingModule { }
