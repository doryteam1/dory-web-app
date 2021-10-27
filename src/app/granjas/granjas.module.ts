import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GranjasRoutingModule } from './granjas-routing.module';
import { GranjasComponent } from './components/granjas/granjas.component';


@NgModule({
  declarations: [
    GranjasComponent
  ],
  imports: [
    CommonModule,
    GranjasRoutingModule
  ]
})
export class GranjasModule { }
