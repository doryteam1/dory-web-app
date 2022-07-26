import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelBusquedaRoutingModule } from './panel-busqueda-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { MisGranjasComponent } from './components/mis-granjas/mis-granjas.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MisVehiculosComponent } from './components/mis-vehiculos/mis-vehiculos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLongPress2Module } from 'ngx-long-press2';
import { MisFavoritosComponent } from './components/mis-favoritos/mis-favoritos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MiConsumoComponent } from './components/mi-consumo/mi-consumo.component';
import { NegociosComponent } from './components/negocios/negocios.component';
import { MisAsociacionesComponent } from './components/mis-asociaciones/mis-asociaciones.component';
import { RouterModule } from '@angular/router';
import { AsociacionDetalleFormComponent } from './components/asociacion-detalle-form/asociacion-detalle-form.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProductosComponent,
    MisGranjasComponent,
    MisProductosComponent,
    MisVehiculosComponent,
    MisFavoritosComponent,
    MiConsumoComponent,
    NegociosComponent,
    MisAsociacionesComponent,
    AsociacionDetalleFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelBusquedaRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgxSpinnerModule,
    SharedModule,
    GoogleMapsModule,
    NgbModule,
    NgxLongPress2Module,
    NgxPaginationModule,
    RouterModule
  ],
})
export class PanelBusquedaModule {}
