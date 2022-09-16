import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComercianteDetalleComponent } from './components/comerciante-detalle/comerciante-detalle.component';
import { NegocioDetalleComponent } from './components/negocio-detalle/negocio-detalle.component';

const routes: Routes = [
  {
    path: 'negocio/detalle/:id',
    component: NegocioDetalleComponent,
  },
  {
    path: 'detalle/:id',
    component: ComercianteDetalleComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComerciantesRoutingModule { }
