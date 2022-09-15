import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NegociosComponent } from './components/negocios/negocios.component';
import { AsociacionesComponent } from './components/asociaciones/asociaciones.component';
import { GranjasComponent } from './components/granjas/granjas.component';
import { UsersComponent } from './components/users/users.component';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { ConsumosComponent } from './components/consumos/consumos.component';


const routes: Routes = [
  {
    path:'',component:HomeComponent,
    children:[
      { path:'', redirectTo:'productos', pathMatch:'full' },
      { path:'productos', component:ProductosComponent},
      {path:'negocios',component:NegociosComponent},
      {path:'asociaciones',component:AsociacionesComponent},
      {path:'pescadores',component:UsersComponent},
      {path:'piscicultores',component:UsersComponent},
      {path:'proveedores',component:UsersComponent},
      {path:'investigadores',component:UsersComponent},
      {path:'granjas',component:GranjasComponent},
      {path:'vehiculos',component:VehiculosComponent},
      {path:'vehiculos',component:VehiculosComponent},
      {path:'transportadores',component:UsersComponent},
      {path:'consumos',component:ConsumosComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelBusquedaRoutingModule { }
