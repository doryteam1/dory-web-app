import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GranjasRoutingModule } from './granjas-routing.module';
import { GranjasComponent } from './components/granjas/granjas.component';
import { GranjasMunicipioComponent } from './components/granjas-municipio/granjas-municipio.component';
import { GranjaDetalleComponent } from './components/granja-detalle/granja-detalle.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { GranjasService } from './services/granjas.service';
import { HttpsService } from '../services/https.service';
@NgModule({
  declarations: [
    GranjasComponent,
    GranjasMunicipioComponent,
    GranjaDetalleComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GranjasRoutingModule,
    NgbModule
  ],
  providers: [
    GranjasService,
    HttpsService
  ]
})
export class GranjasModule { }
