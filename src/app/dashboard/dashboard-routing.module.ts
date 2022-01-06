import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MisGranjasComponent } from './components/mis-granjas/mis-granjas.component';
import { PerfilComponent } from './components/perfil/perfil.component';


const routes: Routes = [
  {
    path:'',component:HomeComponent,
    children:[
      { path:'', redirectTo:'perfil', pathMatch:'full' },
      { path:'perfil', component:PerfilComponent},
      { path:'granjas', component:MisGranjasComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
