import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FloatingBtnComponent } from './components/floating-btn/floating-btn.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    FloatingBtnComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    FloatingBtnComponent
  ]
})
export class SharedModule { }
