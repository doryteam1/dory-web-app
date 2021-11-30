import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PiscicultoresMunicipioComponent } from './components/piscicultores-municipio/piscicultores-municipio.component';
import { PiscicultoresComponent } from './components/piscicultores/piscicultores.component';


const routes: Routes = [
  {
    path:"", component:PiscicultoresComponent
  },
  {
    path:"municipio", component:PiscicultoresMunicipioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PiscicultoresRoutingModule { }
