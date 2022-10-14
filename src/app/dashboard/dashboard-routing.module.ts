import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MisGranjasComponent } from './components/mis-granjas/mis-granjas.component';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { MisVehiculosComponent } from './components/mis-vehiculos/mis-vehiculos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { MisFavoritosComponent } from './components/mis-favoritos/mis-favoritos.component';
import { MiConsumoComponent } from './components/mi-consumo/mi-consumo.component';
import { MisNegociosComponent } from './components/mis-negocios/mis-negocios.component';
import { MisAsociacionesComponent } from './components/mis-asociaciones/mis-asociaciones.component';
import { AsociacionDetalleFormComponent } from './components/asociacion-detalle-form/asociacion-detalle-form.component';
import { GranjaDetalleFormComponent } from './components/granja-detalle-form/granja-detalle-form.component';
import { VehiculoDetalleFormComponent } from './components/vehiculo-detalle-form/vehiculo-detalle-form.component';
import { ProductoDetalleFormComponent } from './components/producto-detalle-form/producto-detalle-form.component';
import { NegocioDtalleFormComponent } from './components/negocio-dtalle-form/negocio-dtalle-form.component';
import { MisPublicacionesComponent } from './components/mis-publicaciones/mis-publicaciones.component';
import { PublicacionDetalleFormComponent } from './components/publicacion-detalle-form/publicacion-detalle-form.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { MisionVisionComponent } from './components/mision-vision/mision-vision.component';
import { NormatividadComponent } from './components/normatividad/normatividad.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { EquipoTrabajoComponent } from './components/equipo-trabajo/equipo-trabajo.component';
import { NovedadesActualidadesComponent } from './components/novedades-actualidades/novedades-actualidades.component';
import { EquipoTrabajoDetalleFormComponent } from './components/equipo-trabajo-detalle-form/equipo-trabajo-detalle-form.component';
import { NovedadActualidadDetalleFormComponent } from './components/novedad-actualidad-detalle-form/novedad-actualidad-detalle-form.component';
import { EventosDetalleFormComponent } from './components/eventos-detalle-form/eventos-detalle-form.component';
import { NormatividadDetalleFormComponent } from './components/normatividad-detalle-form/normatividad-detalle-form.component';
import { SliderInicioComponent } from './components/slider-inicio/slider-inicio.component';
import { SliderInicioDetalleFormComponent } from './components/slider-inicio-detalle-form/slider-inicio-detalle-form.component';
import { EnlacesDirectosInicioComponent } from './components/enlaces-directos-inicio/enlaces-directos-inicio.component';
import { EnlacesDirectosInicioDetalleFormComponent } from './components/enlaces-directos-inicio-detalle-form/enlaces-directos-inicio-detalle-form.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', component: PerfilComponent },
      { path: 'granjas', component: MisGranjasComponent },
      { path: 'mis-productos', component: MisProductosComponent },
      { path: 'producto/detalle', component: ProductoDetalleFormComponent },
      { path: 'mis-vehiculos', component: MisVehiculosComponent },
      { path: 'vehiculo/detalle', component: VehiculoDetalleFormComponent },
      { path: 'mis-favoritos', component: MisFavoritosComponent },
      { path: 'mi-consumo', component: MiConsumoComponent },
      { path: 'mis-negocios', component: MisNegociosComponent },
      { path: 'negocio/detalle', component: NegocioDtalleFormComponent },
      { path: 'mis-asociaciones', component: MisAsociacionesComponent },
      { path: 'asociacion/detalle', component: AsociacionDetalleFormComponent },
      { path: 'equipo-trabajo-admi', component: EquipoTrabajoComponent },
      {
        path: 'equipo-trabajo-admi/detalle',
        component: EquipoTrabajoDetalleFormComponent,
      },
      {
        path: 'novedad-actualidad-admi',
        component: NovedadesActualidadesComponent,
      },
      {
        path: 'novedad-actualidad-admi/detalle',
        component: NovedadActualidadDetalleFormComponent,
      },
      {
        path: 'normatividad-admi/detalle',
        component: NormatividadDetalleFormComponent,
      },
      {
        path: 'slider-inicio-admi',
        component: SliderInicioComponent,
      },
      {
        path: 'slider-inicio-admi/detalle',
        component: SliderInicioDetalleFormComponent,
      },
      {
        path: 'enlaces-directos-inicio-admi',
        component: EnlacesDirectosInicioComponent,
      },
      {
        path: 'enlaces-directos-inicio-admi/detalle',
        component: EnlacesDirectosInicioDetalleFormComponent,
      },
      { path: 'eventos-admi', component: EventosComponent },
      {
        path: 'evento-admi/detalle',
        component: EventosDetalleFormComponent,
      },
      { path: 'granja/detalle', component: GranjaDetalleFormComponent },
      { path: 'mis-publicaciones', component: MisPublicacionesComponent },
      {
        path: 'publicacion/detalle',
        component: PublicacionDetalleFormComponent,
      },
      { path: 'publicaciones', component: PublicacionesComponent },
      { path: 'mision-vision-admi', component: MisionVisionComponent },
      { path: 'normatividad-admi', component: NormatividadComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
