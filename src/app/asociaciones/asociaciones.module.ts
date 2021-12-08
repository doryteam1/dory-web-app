import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AsociacionesRoutingModule } from './asociaciones-routing.module';
import { AsociacionesComponent } from './components/asociaciones/asociaciones.component';
import { AsociacionesMunicipioComponent } from './components/asociaciones-municipio/asociaciones-municipio.component';
import { AsociacionesService } from './servicios/asociaciones.service';
import { HttpsService } from '../services/https.service';


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
    NgbModule
  ],
  providers:[
    AsociacionesService,
    HttpsService
  ]
})
export class AsociacionesModule { }
