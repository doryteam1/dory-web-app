import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormatividadRoutingModule } from './normatividad-routing.module';
import { NormatividadComponent } from './components/normatividad/normatividad.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    NormatividadComponent
  ],
  imports: [
    CommonModule,
    NormatividadRoutingModule,
    SharedModule
  ]
})
export class NormatividadModule { }
