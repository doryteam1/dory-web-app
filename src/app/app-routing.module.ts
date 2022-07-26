import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliticaComponent } from './components/politica/politica.component';
import { CondicionesComponent } from './components/condiciones/condiciones.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BasicMessageComponent } from './components/basic-message/basic-message.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';


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
    path:'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path:'panel-busqueda',
    loadChildren: () => import('./panel-busqueda/panel-busqueda.module').then(m => m.PanelBusquedaModule)
  },
  {
    path:'equipo',
    loadChildren: () => import('./equipo-trabajo/equipo-trabajo.module').then(m => m.EquipoTrabajoModule)
  },
  {
    path:'contacto',
    loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoModule)
  },
  {
    path:'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path:'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path:'update-password',
    loadChildren: () => import('./update-password/update-password.module').then(m => m.UpdatePasswordModule)
  },
  {
    path:'test',
    loadChildren: () => import('./tests/tests.module').then(m => m.TestsModule)
  },
  {
    path:'verify-account',
    component:VerifyAccountComponent
  },
  {
    path:'politica', component:PoliticaComponent
  },
  {
    path:'condiciones', component:CondicionesComponent
  },
  { 
    path: 'welcome', component:WelcomeComponent 
  },
  {
    path:'basic-message', component:BasicMessageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
