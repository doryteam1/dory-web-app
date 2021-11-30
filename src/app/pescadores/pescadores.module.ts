import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PescadoresRoutingModule } from './pescadores-routing.module';
import { PescadoresComponent } from './components/pescadores/pescadores.component';
import { PescadoresMunicipioComponent } from './components/pescadores-municipio/pescadores-municipio.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  declarations: [
    PescadoresComponent,
    PescadoresMunicipioComponent
  ],
  imports: [
    CommonModule,
    PescadoresRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgbModule
  ]
})
export class PescadoresModule { }
