import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PescadorDetalleComponent } from './components/pescador-detalle/pescador-detalle.component';
import { PescadoresMunicipioComponent } from './components/pescadores-municipio/pescadores-municipio.component';
import { PescadoresComponent } from './components/pescadores/pescadores.component';


const routes: Routes = [
  {
    path: '',
    component: PescadoresComponent,
  },
  {
    path: 'municipio/:id',
    component: PescadoresMunicipioComponent,
  },
  {
    path: 'municipio/detalle/:id',
    component: PescadorDetalleComponent,
  },
  {
    path: 'asociacion/:id',
    component: PescadoresMunicipioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PescadoresRoutingModule { }
