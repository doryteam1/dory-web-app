import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule
  ]
})
export class ResetPasswordModule { }
