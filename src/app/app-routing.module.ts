import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path:'nosotros',
    loadChildren: () => import('./nosotros/nosotros.module').then(m => m.NosotrosModule)
  },
  {
    path:'granjas',
    loadChildren: () => import('./granjas/granjas.module').then(m => m.GranjasModule)
  },
  {
    path:'novedades',
    loadChildren: () => import('./novedades/novedades.module').then(m  => m.NovedadesModule)
  },
  {
    path:'eventos',
    loadChildren: () => import('./eventos/eventos.module').then(m => m.EventosModule)
  },
  {
    path:'normatividad',
    loadChildren: () => import('./normatividad/normatividad.module').then(m => m.NormatividadModule)
  },
  {
    path:'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
