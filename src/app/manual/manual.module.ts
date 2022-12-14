import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualRoutingModule } from './manual-routing.module';
import { DocsComponent } from './components/docs/docs.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';


@NgModule({
  declarations: [
    DocsComponent,
    IntroductionComponent,
    ObjetivoComponent
  ],
  imports: [
    CommonModule,
    ManualRoutingModule
  ]
})
export class ManualModule { }
