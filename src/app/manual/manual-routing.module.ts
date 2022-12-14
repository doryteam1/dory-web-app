import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './components/docs/docs.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';

const routes: Routes = [
  {
    path:'', component:DocsComponent,
    children:[
      {
        path:'introduccion', 
        component:IntroductionComponent
      },
      {
        path:'objetivo',
        component:ObjetivoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualRoutingModule { }
