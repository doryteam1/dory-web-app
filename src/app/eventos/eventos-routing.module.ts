import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './components/eventos/eventos.component';

const routes: Routes = [
  {
    path:'cursos',component:EventosComponent
  },
  {
    path:'capacitaciones',component:EventosComponent
  },
  {
    path:'congresos',component:EventosComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
