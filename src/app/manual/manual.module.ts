import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualRoutingModule } from './manual-routing.module';
import { DocsComponent } from './components/docs/docs.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';
import { PuntoInicioComponent } from './components/punto-inicio/punto-inicio.component';
import { GuiaUsoComponent } from './components/guia-uso/guia-uso.component';
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


@NgModule({
  declarations: [
    DocsComponent,
    IntroductionComponent,
    ObjetivoComponent,
    PuntoInicioComponent,
    GuiaUsoComponent,
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
    InterfazPiscicultorComponent
  ],
  imports: [
    CommonModule,
    ManualRoutingModule
  ]
})
export class ManualModule { }
