import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormatividadRoutingModule } from './normatividad-routing.module';
import { NormatividadComponent } from './components/normatividad/normatividad.component';


@NgModule({
  declarations: [
    NormatividadComponent
  ],
  imports: [
    CommonModule,
    NormatividadRoutingModule
  ]
})
export class NormatividadModule { }
