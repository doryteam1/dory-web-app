import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GranjasRoutingModule } from './granjas-routing.module';
import { GranjasComponent } from './components/granjas/granjas.component';
import { GranjasMunicipioComponent } from './components/granjas-municipio/granjas-municipio.component';
import { GranjaDetalleComponent } from './components/granja-detalle/granja-detalle.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { GranjasService } from './services/granjas.service';
import { HttpsService } from '../services/https.service';
import { SharedModule } from '../shared/shared.module';
import { GranjaGalleryComponent } from './components/granja-gallery/granja-gallery.component';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { ShorterPipe } from '../pipes/shorter.pipe';
import { ResenasModalContentComponent } from './components/modals/resenas-modal-content/resenas-modal-content.component';

@NgModule({
  declarations: [
    GranjasComponent,
    GranjasMunicipioComponent,
    GranjaDetalleComponent,
    GranjaGalleryComponent,
    ResenasModalContentComponent,
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GranjasRoutingModule,
    NgbModule,
    SharedModule
  ],
  providers: [
    GranjasService,
    HttpsService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    }
  ]
})
export class GranjasModule { }
