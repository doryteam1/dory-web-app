import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualRoutingModule } from './manual-routing.module';
import { DocsComponent } from './components/docs/docs.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';
import { AreasSitioComponent } from './components/areas-sitio/areas-sitio.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { RegistroGoogleComponent } from './components/registro-google/registro-google.component';
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { InterfazUsuarioComponent } from './components/interfaz-usuario/interfaz-usuario.component';
import { InterfazPescadorComponent } from './components/interfaz-pescador/interfaz-pescador.component';
import { InterfazProveedorComponent } from './components/interfaz-proveedor/interfaz-proveedor.component';
import { InterfazTransportadorComponent } from './components/interfaz-transportador/interfaz-transportador.component';
import { InterfazInvestigadorComponent } from './components/interfaz-investigador/interfaz-investigador.component';
import { InterfazComercianteComponent } from './components/interfaz-comerciante/interfaz-comerciante.component';
import { InterfazConsumidorComponent } from './components/interfaz-consumidor/interfaz-consumidor.component';
import { InterfazPiscicultorComponent } from './components/interfaz-piscicultor/interfaz-piscicultor.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { DoryComponent } from './components/dory/dory.component';
import { ProductoresComponent } from './components/productores/productores.component';
import { NovedadesActualidadComponent } from './components/novedades-actualidad/novedades-actualidad.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { NormatividadComponent } from './components/normatividad/normatividad.component';
import { PanelBusquedaComponent } from './components/panel-busqueda/panel-busqueda.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { CuerpoPaginaComponent } from './components/cuerpo-pagina/cuerpo-pagina.component';
import { PiePaginaComponent } from './components/pie-pagina/pie-pagina.component';
import { InicioComponent } from './components/inicio/inicio.component';


@NgModule({
  declarations: [
    DocsComponent,
    InicioComponent,
    IntroductionComponent,
    ObjetivoComponent,    
    AreasSitioComponent,
    RegistroUsuarioComponent,
    RegistroGoogleComponent,
    CambioContrasenaComponent,
    IngresarComponent,
    InterfazUsuarioComponent,
    InterfazPescadorComponent,
    InterfazProveedorComponent,
    InterfazTransportadorComponent,
    InterfazInvestigadorComponent,
    InterfazComercianteComponent,
    InterfazConsumidorComponent,
    InterfazPiscicultorComponent,
    EncabezadoComponent,
    DoryComponent,
    ProductoresComponent,
    NovedadesActualidadComponent,
    EventosComponent,
    NormatividadComponent,
    PanelBusquedaComponent,
    BuscadorComponent,
    CuerpoPaginaComponent,
    PiePaginaComponent
    
  ],
  imports: [
    CommonModule,
    ManualRoutingModule
  ]
})
export class ManualModule { }
