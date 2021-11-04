import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GranjasRoutingModule } from './granjas-routing.module';
import { GranjasComponent } from './components/granjas/granjas.component';
import { GranjasMunicipioComponent } from './components/granjas-municipio/granjas-municipio.component';
import { GranjaDetalleComponent } from './components/granja-detalle/granja-detalle.component';


@NgModule({
  declarations: [
    GranjasComponent,
    GranjasMunicipioComponent,
    GranjaDetalleComponent
  ],
  imports: [
    CommonModule,
    GranjasRoutingModule
  ]
})
export class GranjasModule { }
