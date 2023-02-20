import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumHomeComponent } from './components/forum-home/forum-home.component';
import { ForumUserResponsesComponent } from './components/forum-user-responses/forum-user-responses.component';

const routes: Routes = [
  {path:'', component:ForumHomeComponent,},
  {
    path: 'respuesta/pregunta/:id',
    component: ForumUserResponsesComponent,
  },
  {
    path: '**',
    redirectTo: '/foro',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
