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


@NgModule({
  declarations: [
    AsociacionesComponent,
    AsociacionesMunicipioComponent
  ],
  imports: [
    CommonModule,
    AsociacionesRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgbModule,
    SharedModule
  ],
  providers:[
    AsociacionesService,
    HttpsService
  ]
})
export class AsociacionesModule { }
