import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportadorDetalleComponent } from './components/transportador-detalle/transportador-detalle.component';
import { VehiculoDetalleComponent } from './components/vehiculo-detalle/vehiculo-detalle.component';

const routes: Routes = [
  {
    path: 'vehiculo/detalle/:id',
    component: VehiculoDetalleComponent,
  },
  {
    path: 'detalle/:id',
    component: TransportadorDetalleComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportadoresRoutingModule { }
