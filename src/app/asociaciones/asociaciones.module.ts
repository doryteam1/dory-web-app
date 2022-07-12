import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AsociacionesRoutingModule } from './asociaciones-routing.module';
import { AsociacionesComponent } from './components/asociaciones/asociaciones.component';
import { AsociacionesMunicipioComponent } from './components/asociaciones-municipio/asociaciones-municipio.component';
import { AsociacionesService } from './services/asociaciones.service';
import { HttpsService } from '../services/https.service';
import { SharedModule } from '../shared/shared.module';
import { SolicitudesModalContentComponent } from './components/modals/solicitudes-modal-content/solicitudes-modal-content.component';
import { PiscicultoresModule } from '../piscicultores/piscicultores.module';
import { PescadoresModule } from '../pescadores/pescadores.module';
import { AsociacionDetalleComponent } from './components/asociacion-detalle/asociacion-detalle.component';


@NgModule({
  declarations: [
    AsociacionesComponent,
    AsociacionesMunicipioComponent,
    SolicitudesModalContentComponent,
    AsociacionDetalleComponent
  ],
  imports: [
    CommonModule,
    AsociacionesRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgbModule,
    SharedModule,
    PiscicultoresModule,
    PescadoresModule
  ],
  providers:[
    AsociacionesService,
    HttpsService
  ]
})
export class AsociacionesModule { }
