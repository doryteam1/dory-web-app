import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreasSitioComponent } from './components/areas-sitio/areas-sitio.component';
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena.component';
import { DocsComponent } from './components/docs/docs.component';
import { GuiaUsoComponent } from './components/guia-uso/guia-uso.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { InterfazComercianteComponent } from './components/interfaz-comerciante/interfaz-comerciante.component';
import { InterfazConsumidorComponent } from './components/interfaz-consumidor/interfaz-consumidor.component';
import { InterfazInvestigadorComponent } from './components/interfaz-investigador/interfaz-investigador.component';
import { InterfazPescadorComponent } from './components/interfaz-pescador/interfaz-pescador.component';
import { InterfazPiscicultorComponent } from './components/interfaz-piscicultor/interfaz-piscicultor.component';
import { InterfazProveedorComponent } from './components/interfaz-proveedor/interfaz-proveedor.component';
import { InterfazTransportadorComponent } from './components/interfaz-transportador/interfaz-transportador.component';
import { InterfazUsuarioComponent } from './components/interfaz-usuario/interfaz-usuario.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';
import { PuntoInicioComponent } from './components/punto-inicio/punto-inicio.component';
import { RegistroGoogleComponent } from './components/registro-google/registro-google.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';

const routes: Routes = [
  {
    path:'', component:DocsComponent,
    children:[
      {
        path:'',
        redirectTo:'introduccion',
        pathMatch:'full'
      },
      {
        path:'introduccion', 
        component:IntroductionComponent
      },
      {
        path:'objetivo',
        component:ObjetivoComponent
      },
      {
        path:'guia-uso',
        component:GuiaUsoComponent
      },
      {
        path:'punto-inicio',
        component:PuntoInicioComponent
      },
      {
        path:'areas-sitio',
        component:AreasSitioComponent
      },
      {
        path:'registro-usuario',
        component:RegistroUsuarioComponent
      },
      {
        path:'registro-google',
        component:RegistroGoogleComponent
      },
      {
        path:'cambio-contrasena',
        component:CambioContrasenaComponent
      },
      {
        path:'ingresar',
        component:IngresarComponent
      },
      {
        path:'interfaz-usuario',
        component:InterfazUsuarioComponent
      },
      {
        path:'interfaz-pescador',
        component:InterfazPescadorComponent
      },
      {
        path:'interfaz-proveedor',
        component:InterfazProveedorComponent
      },
      {
        path:'interfaz-transportador',
        component:InterfazTransportadorComponent
      },
      {
        path:'interfaz-investigador',
        component:InterfazInvestigadorComponent
      },
      {
        path:'interfaz-comerciante',
        component:InterfazComercianteComponent
      },
      {
        path:'interfaz-consumidor',
        component:InterfazConsumidorComponent
      },
      {
        path:'interfaz-piscicultor',
        component:InterfazPiscicultorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualRoutingModule { }
