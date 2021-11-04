import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GranjaDetalleComponent } from './components/granja-detalle/granja-detalle.component';
import { GranjasMunicipioComponent } from './components/granjas-municipio/granjas-municipio.component';
import { GranjasComponent } from './components/granjas/granjas.component';

const routes: Routes = [
  {
    path:'', component:GranjasComponent
  },
  {
    path:'municipio',
    component:GranjasMunicipioComponent,
  },
  {
    path:'municipio/detalle-granja',
    component:GranjaDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GranjasRoutingModule { }
