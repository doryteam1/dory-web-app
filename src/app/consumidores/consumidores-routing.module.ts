import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumidorDetalleComponent } from './components/consumidor-detalle/consumidor-detalle.component';

const routes: Routes = [
  { path: 'detalle/:id', component: ConsumidorDetalleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumidoresRoutingModule { }
