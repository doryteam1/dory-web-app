import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsociacionesMunicipioComponent } from './components/asociaciones-municipio/asociaciones-municipio.component';
import { AsociacionesComponent } from './components/asociaciones/asociaciones.component';

const routes: Routes = [
  {
    path:'', component:AsociacionesComponent
  },
  {
    path:'municipio/:id', component: AsociacionesMunicipioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsociacionesRoutingModule { }
