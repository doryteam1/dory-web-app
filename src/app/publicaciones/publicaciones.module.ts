import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionesRoutingModule } from './publicaciones-routing.module';
import { PublicacionComponent } from './components/publicacion/publicacion.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PublicacionDetalleComponent } from './components/publicacion-detalle/publicacion-detalle.component';


@NgModule({
  declarations: [PublicacionComponent, PublicacionDetalleComponent],
  exports: [PublicacionComponent],
  imports: [
    CommonModule,
    PublicacionesRoutingModule,
    SharedModule,
    NgxSpinnerModule,
  ],
})
export class PublicacionesModule {}
