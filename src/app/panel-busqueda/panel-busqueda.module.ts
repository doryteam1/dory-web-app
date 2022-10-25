import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelBusquedaRoutingModule } from './panel-busqueda-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLongPress2Module } from 'ngx-long-press2';
import { NgxPaginationModule } from 'ngx-pagination';
import { NegociosComponent } from './components/negocios/negocios.component';
import { RouterModule } from '@angular/router';
import { AsociacionesComponent } from './components/asociaciones/asociaciones.component';
import { GranjasComponent } from './components/granjas/granjas.component';
import { UsersComponent } from './components/users/users.component';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { ConsumosComponent } from './components/consumos/consumos.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    HomeComponent,
    ProductosComponent,
    NegociosComponent,
    AsociacionesComponent,
    UsersComponent,
    GranjasComponent,
    VehiculosComponent,
    ConsumosComponent,
  ],
  exports: [GranjasComponent],
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
    RouterModule,
    NgChartsModule,
  ],
})
export class PanelBusquedaModule {}
