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
import { GranjasTodasComponent } from './components/granjas-todas/granjas-todas.component';
import { BarraNotificacionGeneralComponent } from './components/barra-notificacion-general/barra-notificacion-general.component';
import { BarraNotificacionDetalleFormComponent } from './components/barra-notificacion-detalle-form/barra-notificacion-detalle-form.component';
import { MonthPickerComponent } from './components/month-picker/month-picker.component';
import { UpdatePasswordComponent } from '../update-password/components/update-password/update-password.component';
import { UserRoleAccessGuard } from '../guards/user-role-access.guard';
const userRoles: { [key: number]:string } = {
  1: 'all',
  2: 'Administrador',
  3: 'Piscicultor',
  4: 'Pescador',
  5: 'Proveedor',
  6: 'Transportador',
  7: 'Consumidor',
  8: 'Comerciante'
};

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivateChild: [UserRoleAccessGuard],
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      {
        path: 'perfil',
        component: PerfilComponent,
        data: {
          rol: [userRoles[1]],
        },
      },
      {
        path: 'mis-favoritos',
        component: MisFavoritosComponent,
        data: {
          rol: [userRoles[1]],
          denied: userRoles[2],
        },
      },
      {
        path: 'update-password',
        component: UpdatePasswordComponent,
        data: {
          rol: [userRoles[1]],
        },
      },
      {
        path: 'granjas',
        component: MisGranjasComponent,
        data: {
          rol: [userRoles[3]],
        },
      },
      {
        path: 'granja/detalle',
        component: GranjaDetalleFormComponent,
        data: {
          rol: [userRoles[3]],
        },
      },
      {
        path: 'mis-productos',
        component: MisProductosComponent,
        data: {
          rol: [userRoles[5],userRoles[8]],
        },
      },
      {
        path: 'producto/detalle',
        component: ProductoDetalleFormComponent,
        data: {
          rol: [userRoles[5],userRoles[8]],
        },
      },

      {
        path: 'mis-vehiculos',
        component: MisVehiculosComponent,
        data: {
          rol: [userRoles[6]],
        },
      },

      {
        path: 'vehiculo/detalle',
        component: VehiculoDetalleFormComponent,
        data: {
          rol: [userRoles[6]],
        },
      },

      {
        path: 'mi-consumo',
        component: MonthPickerComponent,
        data: {
          rol: [userRoles[7]],
        },
      },
      {
        path: 'form-consumo',
        component: MiConsumoComponent,
        data: {
          rol: [userRoles[7]],
        },
      },
      {
        path: 'mis-negocios',
        component: MisNegociosComponent,
        data: {
          rol: [userRoles[5], userRoles[8]],
        },
      },
      {
        path: 'negocio/detalle',
        component: NegocioDtalleFormComponent,
        data: {
          rol: [userRoles[5], userRoles[8]],
        },
      },

      {
        path: 'mis-asociaciones',
        component: MisAsociacionesComponent,
        data: {
          rol: [userRoles[3], userRoles[4]],
        },
      },
      {
        path: 'asociacion/detalle',
        component: AsociacionDetalleFormComponent,
        data: {
          rol: [userRoles[3], userRoles[4]],
        },
      },
      {
        path: 'mis-publicaciones',
        component: MisPublicacionesComponent,
        data: {
          rol: [userRoles[3], userRoles[4]],
        },
      },

      {
        path: 'publicacion/detalle',
        component: PublicacionDetalleFormComponent,
        data: {
          rol: [userRoles[3], userRoles[4]],
        },
      },

      {
        path: 'publicaciones',
        component: PublicacionesComponent,
        data: {
          rol: [userRoles[8]],
        },
      },

      {
        path: 'equipo-trabajo-admi',
        component: EquipoTrabajoComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'equipo-trabajo-admi/detalle',
        component: EquipoTrabajoDetalleFormComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'novedad-actualidad-admi',
        component: NovedadesActualidadesComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'novedad-actualidad-admi/detalle',
        component: NovedadActualidadDetalleFormComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'normatividad-admi/detalle',
        component: NormatividadDetalleFormComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'slider-inicio-admi',
        component: SliderInicioComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'granjas-todas-admi',
        component: GranjasTodasComponent,
        data: {
          rol: [userRoles[2]],
        },
      },

      {
        path: 'slider-inicio-admi/detalle',
        component: SliderInicioDetalleFormComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'barra-notificacion-general-admi',
        component: BarraNotificacionGeneralComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'barra-notificacion-general-admi/detalle',
        component: BarraNotificacionDetalleFormComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'enlaces-directos-inicio-admi',
        component: EnlacesDirectosInicioComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'enlaces-directos-inicio-admi/detalle',
        component: EnlacesDirectosInicioDetalleFormComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'eventos-admi',
        component: EventosComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'evento-admi/detalle',
        component: EventosDetalleFormComponent,
        data: {
          rol: [userRoles[2]],
        },
      },

      {
        path: 'mision-vision-admi',
        component: MisionVisionComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
      {
        path: 'normatividad-admi',
        component: NormatividadComponent,
        data: {
          rol: [userRoles[2]],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
