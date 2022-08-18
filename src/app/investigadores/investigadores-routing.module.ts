import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestigadorDetalleComponent } from './components/investigador-detalle/investigador-detalle.component';

const routes: Routes = [
  {path:'detalle/:id',component:InvestigadorDetalleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestigadoresRoutingModule { }
