import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FloatingBtnComponent } from './components/floating-btn/floating-btn.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    FloatingBtnComponent,
    SearchBarComponent,
    NotificationBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    FloatingBtnComponent,
    SearchBarComponent,
    NotificationBarComponent
  ]
})
export class SharedModule { }
