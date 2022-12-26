import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreasSitioComponent } from './components/areas-sitio/areas-sitio.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena.component';
import { CuerpoPaginaComponent } from './components/cuerpo-pagina/cuerpo-pagina.component';
import { DocsComponent } from './components/docs/docs.component';
import { DoryComponent } from './components/dory/dory.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { EventosComponent } from './components/eventos/eventos.component';
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
import { NormatividadComponent } from './components/normatividad/normatividad.component';
import { NovedadesActualidadComponent } from './components/novedades-actualidad/novedades-actualidad.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';
import { PanelBusquedaComponent } from './components/panel-busqueda/panel-busqueda.component';
import { PiePaginaComponent } from './components/pie-pagina/pie-pagina.component';
import { ProductoresComponent } from './components/productores/productores.component';
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
      },
      {
        path:'encabezado',
        component:EncabezadoComponent
      },
      {
        path:'dory',
        component:DoryComponent
      },
      {
        path:'productores',
        component:ProductoresComponent
      },
      {
        path:'novedades',
        component:NovedadesActualidadComponent
      },
      {
        path:'eventos',
        component:EventosComponent
      },
      {
        path:'normatividad',
        component:NormatividadComponent
      },
      {
        path:'panel-busqueda',
        component:PanelBusquedaComponent
      },
      {
        path:'buscador',
        component:BuscadorComponent
      },
      {
        path:'cuerpo-pagina',
        component:CuerpoPaginaComponent
      },
      {
        path:'pie-pagina',
        component:PiePaginaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualRoutingModule { }
