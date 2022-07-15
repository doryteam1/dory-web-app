import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PiscicultorDetalleComponent } from './components/piscicultor-detalle/piscicultor-detalle.component';
import { PiscicultoresMunicipioComponent } from './components/piscicultores-municipio/piscicultores-municipio.component';
import { PiscicultoresComponent } from './components/piscicultores/piscicultores.component';


const routes: Routes = [
  {
    path:"", component:PiscicultoresComponent
  },
  {
    path:"municipio/:id", component:PiscicultoresMunicipioComponent
  },
  {
    path:'municipio/detalle/:id',component:PiscicultorDetalleComponent
  },
  {
    path:'detalle/:id',component:PiscicultorDetalleComponent
  },
  {
    path:"asociacion/:id", component:PiscicultoresMunicipioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PiscicultoresRoutingModule { }
