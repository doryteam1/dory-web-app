import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsociacionDetalleComponent } from './components/asociacion-detalle/asociacion-detalle.component';
import { AsociacionesMunicipioComponent } from './components/asociaciones-municipio/asociaciones-municipio.component';
import { AsociacionesComponent } from './components/asociaciones/asociaciones.component';

const routes: Routes = [
  {
    path: '',
    component: AsociacionesComponent,
  },
  {
    path: 'municipio/:id',
    component: AsociacionesMunicipioComponent,
  },
  {
    path: 'municipio/detalle/:id',
    component: AsociacionDetalleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsociacionesRoutingModule { }
