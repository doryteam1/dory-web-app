import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MisGranjasComponent } from './components/mis-granjas/mis-granjas.component';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { MisVehiculosComponent } from './components/mis-vehiculos/mis-vehiculos.component';
import { PerfilComponent } from './components/perfil/perfil.component';


const routes: Routes = [
  {
    path:'',component:HomeComponent,
    children:[
      { path:'', redirectTo:'perfil', pathMatch:'full' },
      { path:'perfil', component:PerfilComponent},
      { path:'granjas', component:MisGranjasComponent},
      { path:'mis-productos', component:MisProductosComponent},
      { path:'mis-vehiculos', component:MisVehiculosComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
