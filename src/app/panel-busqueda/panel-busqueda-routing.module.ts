import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NegociosComponent } from './components/negocios/negocios.component';
import { AsociacionesComponent } from './components/asociaciones/asociaciones.component';


const routes: Routes = [
  {
    path:'',component:HomeComponent,
    children:[
      { path:'', redirectTo:'productos', pathMatch:'full' },
      { path:'productos', component:ProductosComponent},
      {path:'negocios',component:NegociosComponent},
      {path:'asociaciones',component:AsociacionesComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelBusquedaRoutingModule { }
