import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GranjasComponent } from './components/granjas/granjas.component';

const routes: Routes = [
  {
    path:'', component:GranjasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GranjasRoutingModule { }
