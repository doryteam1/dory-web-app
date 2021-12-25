import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliticaComponent } from './components/politica/politica.component';

const routes: Routes = [
  {
    path:'', redirectTo:'/home', pathMatch:'full'
  },
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
  },
  {
    path:'piscicultores',
    loadChildren: () => import('./piscicultores/piscicultores.module').then(m => m.PiscicultoresModule)
  },
  {
    path:'pescadores',
    loadChildren: () => import('./pescadores/pescadores.module').then(m => m.PescadoresModule)
  },
  {
    path:'asociaciones',
    loadChildren: () => import('./asociaciones/asociaciones.module').then(m => m.AsociacionesModule)
  },
  {
    path:'politica', component:PoliticaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
