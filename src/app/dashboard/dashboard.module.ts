import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './components/home/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { MisGranjasComponent } from './components/mis-granjas/mis-granjas.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MisVehiculosComponent } from './components/mis-vehiculos/mis-vehiculos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLongPress2Module } from 'ngx-long-press2';
import { MisFavoritosComponent } from './components/mis-favoritos/mis-favoritos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MiConsumoComponent } from './components/mi-consumo/mi-consumo.component';
import { MisNegociosComponent } from './components/mis-negocios/mis-negocios.component';
import { MisAsociacionesComponent } from './components/mis-asociaciones/mis-asociaciones.component';
import { RouterModule } from '@angular/router';
import { AsociacionDetalleFormComponent } from './components/asociacion-detalle-form/asociacion-detalle-form.component';
import { GranjaDetalleFormComponent } from './components/granja-detalle-form/granja-detalle-form.component';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { ProductoDetalleFormComponent } from './components/producto-detalle-form/producto-detalle-form.component';
import { VehiculoDetalleFormComponent } from './components/vehiculo-detalle-form/vehiculo-detalle-form.component';
import { NegocioDtalleFormComponent } from './components/negocio-dtalle-form/negocio-dtalle-form.component';
import { MisPublicacionesComponent } from './components/mis-publicaciones/mis-publicaciones.component';
import { PublicacionDetalleFormComponent } from './components/publicacion-detalle-form/publicacion-detalle-form.component';


@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    MisGranjasComponent,
    MisProductosComponent,
    MisVehiculosComponent,
    MisFavoritosComponent,
    MiConsumoComponent,
    MisNegociosComponent,
    MisAsociacionesComponent,
    AsociacionDetalleFormComponent,
    GranjaDetalleFormComponent,
    ProductoDetalleFormComponent,
    VehiculoDetalleFormComponent,
    NegocioDtalleFormComponent,
    MisPublicacionesComponent,
    PublicacionDetalleFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgxSpinnerModule,
    SharedModule,
    GoogleMapsModule,
    NgbModule,
    NgxLongPress2Module,
    NgxPaginationModule,
    RouterModule,
    GuidedTourModule
  ],
  providers:[
    GuidedTourService
  ]
})
export class DashboardModule {}
