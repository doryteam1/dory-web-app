import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosRoutingModule } from './eventos-routing.module';
import { EventosComponent } from './components/eventos/eventos.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    EventosComponent
  ],
  imports: [
    CommonModule,
    EventosRoutingModule,
    SharedModule
  ]
})
export class EventosModule { }
