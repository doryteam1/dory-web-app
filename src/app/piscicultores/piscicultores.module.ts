import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PiscicultoresRoutingModule } from './piscicultores-routing.module';
import { PiscicultoresComponent } from './components/piscicultores/piscicultores.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PiscicultoresMunicipioComponent } from './components/piscicultores-municipio/piscicultores-municipio.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PiscicultoresService } from './services/piscicultores.service';
import { HttpsService } from '../services/https.service';
import { SharedModule } from '../shared/shared.module';
import { PiscicultorDetalleComponent } from './components/piscicultor-detalle/piscicultor-detalle.component';

@NgModule({
  declarations: [
    PiscicultoresComponent,
    PiscicultoresMunicipioComponent,
    PiscicultorDetalleComponent,

  ],
  exports:[
    PiscicultoresComponent
  ],
  imports: [
    CommonModule,
    PiscicultoresRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgbModule,
    SharedModule
  ],
  providers: [
    PiscicultoresService,
    HttpsService,
    SharedModule
  ]
})
export class PiscicultoresModule { }
