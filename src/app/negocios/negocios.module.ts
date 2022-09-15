import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NegociosRoutingModule } from './negocios-routing.module';
import { GalleryModule } from 'ng-gallery';
import { NegocioDetalleComponent } from './components/negocio-detalle/negocio-detalle.component';


@NgModule({
  declarations: [
    NegocioDetalleComponent
  ],
  imports: [
    CommonModule,
    NegociosRoutingModule,
    GalleryModule
  ]
})
export class NegociosModule { }
