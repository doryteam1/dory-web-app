import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicacionDetalleComponent } from './components/publicacion-detalle/publicacion-detalle.component';
import { PublicacionComponent } from './components/publicacion/publicacion.component';

const routes: Routes = [
  {
    path: '',
    component: PublicacionComponent,
  },
  {
    path: 'publicacion/detalle/:id',
    component: PublicacionDetalleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicacionesRoutingModule { }
