import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormatividadComponent } from './components/normatividad/normatividad.component';

const routes: Routes = [
  {
    path:'', component:NormatividadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NormatividadRoutingModule { }
