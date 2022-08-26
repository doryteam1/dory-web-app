import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportadorDetalleComponent } from './components/transportador-detalle/transportador-detalle.component';

const routes: Routes = [
  {
    path:'detalle/:id', component:TransportadorDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportadoresRoutingModule { }
