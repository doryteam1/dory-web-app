import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovedadesComponent } from './components/novedades/novedades.component';

const routes: Routes = [
  {
    path:'articulos', component:NovedadesComponent
  },
  {
    path:'articulos-colombia', component:NovedadesComponent
  },
  {
    path:'revistas', component:NovedadesComponent
  },
  {
    path:'noticias', component:NovedadesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovedadesRoutingModule { }
