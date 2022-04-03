import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestsRoutingModule } from './tests-routing.module';
import { TestComponent } from './components/test/test.component';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    TestsRoutingModule,
    GoogleMapsModule
  ]
})
export class TestsModule { }
