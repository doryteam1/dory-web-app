import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipoTrabajoComponent } from './components/equipo-trabajo/equipo-trabajo.component';

const routes: Routes = [
  { path:'', component:EquipoTrabajoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipoTrabajoRoutingModule { }
