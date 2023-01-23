import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormatividadComponent } from './components/normatividad/normatividad.component';

const routes: Routes = [
  {
    path: 'leyes',
    component: NormatividadComponent,
  },
  {
    path: 'estatutos',
    component: NormatividadComponent,
  },
  {
    path: 'decretos',
    component: NormatividadComponent,
  },
  {
    path: 'resoluciones',
    component: NormatividadComponent,
  },
  {
    path: '**',
    redirectTo: '/geolocalizacion/granjas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NormatividadRoutingModule { }
