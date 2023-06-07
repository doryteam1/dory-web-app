import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { PoliticaComponent } from './components/politica/politica.component';
import { CondicionesComponent } from './components/condiciones/condiciones.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BasicMessageComponent } from './components/basic-message/basic-message.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { WelcomeGuard } from './guards/welcome.guard';
import { AsociacionesComponent } from './panel-busqueda/components/asociaciones/asociaciones.component';
import {IsAuthenticatedGuard } from './guards/isAuthenticated.guard';
import { ProcessAbortRegisterComponent } from './components/process-abort-register/process-abort-register.component';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';




const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'nosotros',
    loadChildren: () =>
      import('./nosotros/nosotros.module').then((m) => m.NosotrosModule),
  },
  {
    path: 'granjas',
    loadChildren: () =>
      import('./granjas/granjas.module').then((m) => m.GranjasModule),
  },
  {
    path: 'novedades',
    loadChildren: () =>
      import('./novedades/novedades.module').then((m) => m.NovedadesModule),
  },
  {
    path: 'eventos',
    loadChildren: () =>
      import('./eventos/eventos.module').then((m) => m.EventosModule),
  },
  {
    path: 'foro',
    loadChildren: () =>
      import('./forum/forum.module').then((m) => m.ForumModule),
  },
  {
    path: 'normatividad',
    loadChildren: () =>
      import('./normatividad/normatividad.module').then(
        (m) => m.NormatividadModule
      ),
  },
  {
    path: 'geolocalizacion',
    loadChildren: () =>
      import('./geolocalizacion/geolocalizacion.module').then(
        (m) => m.GeolocalizacionModule
      ),
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./registro/registro.module').then((m) => m.RegistroModule),
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'piscicultores',
    loadChildren: () =>
      import('./piscicultores/piscicultores.module').then(
        (m) => m.PiscicultoresModule
      ),
  },
  {
    path: 'pescadores',
    loadChildren: () =>
      import('./pescadores/pescadores.module').then((m) => m.PescadoresModule),
  },
  {
    path: 'proveedores',
    loadChildren: () =>
      import('./proveedores/proveedores.module').then(
        (m) => m.ProveedoresModule
      ),
  },
  {
    path: 'transportadores',
    loadChildren: () =>
      import('./transportadores/transportadores.module').then(
        (m) => m.TransportadoresModule
      ),
  },
  {
    path: 'asociaciones',
    loadChildren: () =>
      import('./asociaciones/asociaciones.module').then(
        (m) => m.AsociacionesModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canLoad: [IsLoggedInGuard],
    canActivate:[IsLoggedInGuard],
  },
  {
    path: 'panel-busqueda',
    loadChildren: () =>
      import('./panel-busqueda/panel-busqueda.module').then(
        (m) => m.PanelBusquedaModule
      ),
  },
  {
    path: 'equipo',
    loadChildren: () =>
      import('./equipo-trabajo/equipo-trabajo.module').then(
        (m) => m.EquipoTrabajoModule
      ),
  },
  {
    path: 'contacto',
    loadChildren: () =>
      import('./contacto/contacto.module').then((m) => m.ContactoModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
  {
    path: 'update-password',
    loadChildren: () =>
      import('./update-password/update-password.module').then(
        (m) => m.UpdatePasswordModule
      ),
  },
  {
    path: 'test',
    loadChildren: () =>
      import('./tests/tests.module').then((m) => m.TestsModule),
  },
  {
    path: 'investigadores',
    loadChildren: () =>
      import('./investigadores/investigadores.module').then(
        (m) => m.InvestigadoresModule
      ),
  },
  {
    path: 'consumidores',
    loadChildren: () =>
      import('./consumidores/consumidores.module').then(
        (m) => m.ConsumidoresModule
      ),
  },
  {
    path: 'comerciantes',
    loadChildren: () =>
      import('./comerciantes/comerciantes.module').then(
        (m) => m.ComerciantesModule
      ),
  },
  {
    path: 'publicaciones',
    loadChildren: () =>
      import('./publicaciones/publicaciones.module').then(
        (m) => m.PublicacionesModule
      ),
  },
  {
    path: 'manual',
    loadChildren: () =>
      import('./manual/manual.module').then((m) => m.ManualModule),
  },
  {
    path: 'download-resource-dory',
    loadChildren: () =>
      import('./download-resource-dory/download-resource-dory.module').then(
        (m) => m.DownloadResourceDoryModule
      ),
  },
  {
    path: 'testchat',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: 'verify-account',
    component: VerifyAccountComponent,
  },
  {
    path: 'grupo-asociaciones',
    component: AsociacionesComponent,
  },
  {
    path: 'politica',
    component: PoliticaComponent,
  },
  {
    path: 'condiciones',
    component: CondicionesComponent,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [WelcomeGuard],
  },
  {
    path: 'basic-message',
    component: BasicMessageComponent,
  },
  {
    path: 'abort-register',
    component: ProcessAbortRegisterComponent,
    canActivate: [WelcomeGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
