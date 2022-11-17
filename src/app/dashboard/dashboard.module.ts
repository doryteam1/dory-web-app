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
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { ProductoDetalleFormComponent } from './components/producto-detalle-form/producto-detalle-form.component';
import { VehiculoDetalleFormComponent } from './components/vehiculo-detalle-form/vehiculo-detalle-form.component';
import { NegocioDtalleFormComponent } from './components/negocio-dtalle-form/negocio-dtalle-form.component';
import { MisPublicacionesComponent } from './components/mis-publicaciones/mis-publicaciones.component';
import { PublicacionDetalleFormComponent } from './components/publicacion-detalle-form/publicacion-detalle-form.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';
import { MisionVisionComponent } from './components/mision-vision/mision-vision.component';
import { EquipoTrabajoComponent } from './components/equipo-trabajo/equipo-trabajo.component';
import { NovedadesActualidadesComponent } from './components/novedades-actualidades/novedades-actualidades.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { NormatividadComponent } from './components/normatividad/normatividad.component';
import { EquipoTrabajoDetalleFormComponent } from './components/equipo-trabajo-detalle-form/equipo-trabajo-detalle-form.component';
import { NovedadActualidadDetalleFormComponent } from './components/novedad-actualidad-detalle-form/novedad-actualidad-detalle-form.component';
import { EventosDetalleFormComponent } from './components/eventos-detalle-form/eventos-detalle-form.component';
import { NormatividadDetalleFormComponent } from './components/normatividad-detalle-form/normatividad-detalle-form.component';
import { SliderInicioComponent } from './components/slider-inicio/slider-inicio.component';
import { SliderInicioDetalleFormComponent } from './components/slider-inicio-detalle-form/slider-inicio-detalle-form.component';
import { EnlacesDirectosInicioComponent } from './components/enlaces-directos-inicio/enlaces-directos-inicio.component';
import { EnlacesDirectosInicioDetalleFormComponent } from './components/enlaces-directos-inicio-detalle-form/enlaces-directos-inicio-detalle-form.component';
import { GalleryModule } from 'ng-gallery';
import { PanelBusquedaModule } from '../panel-busqueda/panel-busqueda.module';
import { GranjasTodasComponent } from './components/granjas-todas/granjas-todas.component';
import { FotosMiniDetalleFormComponent } from './components/fotos-mini-detalle-form/fotos-mini-detalle-form.component';
import { BarraNotificacionGeneralComponent } from './components/barra-notificacion-general/barra-notificacion-general.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ColorPickerModule } from 'ngx-color-picker';
import { BarraNotificacionDetalleFormComponent } from './components/barra-notificacion-detalle-form/barra-notificacion-detalle-form.component';
import { MonthPickerComponent } from './components/month-picker/month-picker.component';
import { UpdatePasswordModule } from '../update-password/update-password.module';
import { NgChartsModule } from 'ng2-charts';




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
    PublicacionDetalleFormComponent,
    PublicacionesComponent,
    MisionVisionComponent,
    EquipoTrabajoComponent,
    NovedadesActualidadesComponent,
    EventosComponent,
    NormatividadComponent,
    EquipoTrabajoDetalleFormComponent,
    NovedadActualidadDetalleFormComponent,
    EventosDetalleFormComponent,
    NormatividadDetalleFormComponent,
    SliderInicioComponent,
    SliderInicioDetalleFormComponent,
    EnlacesDirectosInicioComponent,
    EnlacesDirectosInicioDetalleFormComponent,
    GranjasTodasComponent,
    FotosMiniDetalleFormComponent,
    BarraNotificacionGeneralComponent,
    BarraNotificacionDetalleFormComponent,
    MonthPickerComponent,
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
    GuidedTourModule,
    PublicacionesModule,
    GalleryModule,
    PanelBusquedaModule,
    AngularEditorModule,
    ColorPickerModule,
    UpdatePasswordModule,
    NgChartsModule,
  ],
  providers: [GuidedTourService],
})
export class DashboardModule {}
