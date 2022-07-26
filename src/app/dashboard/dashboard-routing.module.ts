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


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', component: PerfilComponent },
      { path: 'granjas', component: MisGranjasComponent },
      { path: 'mis-productos', component: MisProductosComponent },
      { path: 'mis-vehiculos', component: MisVehiculosComponent },
      { path: 'mis-favoritos', component: MisFavoritosComponent },
      { path: 'mi-consumo', component: MiConsumoComponent },
      { path: 'mis-negocios', component: MisNegociosComponent },
      { path: 'mis-asociaciones', component: MisAsociacionesComponent },
      { path: 'asociacion/detalle', component: AsociacionDetalleFormComponent },
      { path: 'granja/detalle', component: GranjaDetalleFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
