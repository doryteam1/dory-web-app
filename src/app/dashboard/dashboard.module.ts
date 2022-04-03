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


@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    MisGranjasComponent,
    MisProductosComponent,
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
    GoogleMapsModule
  ]
})
export class DashboardModule { }
