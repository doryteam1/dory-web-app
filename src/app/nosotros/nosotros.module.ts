import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NosotrosRoutingModule } from './nosotros-routing.module';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    NosotrosComponent
  ],
  imports: [
    CommonModule,
    NosotrosRoutingModule,
    SharedModule
  ]
})
export class NosotrosModule { }
