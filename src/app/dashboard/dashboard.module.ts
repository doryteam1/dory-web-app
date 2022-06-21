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
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MisVehiculosComponent } from './components/mis-vehiculos/mis-vehiculos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLongPress2Module } from 'ngx-long-press2';
import { MisFavoritosComponent } from './components/mis-favoritos/mis-favoritos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MiConsumoComponent } from './components/mi-consumo/mi-consumo.component';
import { MisNegociosComponent } from './components/mis-negocios/mis-negocios.component';


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
  ],
})
export class DashboardModule {}
