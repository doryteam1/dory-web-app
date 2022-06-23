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
import { TopAlertComponent } from './components/top-alert/top-alert.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ConfirmModalMapComponent } from './components/confirm-modal-map/confirm-modal-map.component';
import { AppModalService } from './services/app-modal.service';
import { ConfirmModalMapService } from './services/confirm-modal-map.service';
import { ShorterPipe } from '../pipes/shorter.pipe';
import { StarsComponent } from './components/stars/stars.component';
import { ModalGallerySliderComponent } from './components/modal-gallery-slider/modal-gallery-slider.component';
import { ModalGallerySliderService } from './services/modal-gallery-slider.service';
import { CarrucelImgComponent } from './components/carrucel-img/carrucel-img.component';
import { GranjasService } from '../../app/granjas/services/granjas.service';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { HttpsService } from '../services/https.service';
import {
  HttpClientModule,
  HttpClientJsonpModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ModalGoogleMapComponent } from './components/modal-google-map/modal-google-map.component';
import { ModalShareButtonComponent } from './components/modal-share-button/modal-share-button.component';




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
    MapSucreComponent,
    TopAlertComponent,
    ConfirmModalComponent,
    ConfirmModalMapComponent,
    ShorterPipe,
    StarsComponent,
    ModalGallerySliderComponent,
    CarrucelImgComponent,
    ModalGallerySliderComponent,
    CarrucelImgComponent,
    ModalShareButtonComponent,
    ModalGoogleMapComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ShareButtonsModule,
    ShareIconsModule,
    GoogleMapsModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    FloatingBtnComponent,
    SearchBarComponent,
    NotificationBarComponent,
    SearchComponent,
    FloatingBtnAutoUpComponent,
    BasicMessageComponent,
    MapSucreComponent,
    TopAlertComponent,
    ConfirmModalComponent,
    ConfirmModalMapComponent,
    ShorterPipe,
    StarsComponent,
    CarrucelImgComponent,
    ModalShareButtonComponent,
   /*  CardphotoGoogleMapComponent, */
  ],
  providers: [
    ConfirmModalMapService,
    ModalGallerySliderService,
    GranjasService,
    ConfirmModalMapService,
    AppModalService,
    HttpsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
