import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FloatingBtnComponent } from './components/floating-btn/floating-btn.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { FloatingBtnAutoUpComponent } from './components/floating-btn-auto-up/floating-btn-auto-up.component';
import { BasicMessageComponent } from '../components/basic-message/basic-message.component';
import { MapSucreComponent } from './components/map-sucre/map-sucre.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    FloatingBtnComponent,
    SearchBarComponent,
    NotificationBarComponent,
    SearchComponent,
    FloatingBtnAutoUpComponent,
    BasicMessageComponent,
    MapSucreComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    FloatingBtnComponent,
    SearchBarComponent,
    NotificationBarComponent,
    SearchComponent,
    FloatingBtnAutoUpComponent,
    BasicMessageComponent,
    MapSucreComponent
  ]
})
export class SharedModule { }
