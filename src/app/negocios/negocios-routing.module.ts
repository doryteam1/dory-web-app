import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NegocioDetalleComponent } from './components/negocio-detalle/negocio-detalle.component';

const routes: Routes = [
  {
    path:'detalle/:id', component:NegocioDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegociosRoutingModule { }
