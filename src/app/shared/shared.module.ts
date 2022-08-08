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
import { CardAsociacionComponent } from './components/card-asociacion/card-asociacion.component';
import { BasicFloatingBtnComponent } from './components/basic-floating-btn/basic-floating-btn.component';
import { CardGranjasComponent } from './components/card-granjas/card-granjas.component';
import { ModalAlertActualizadoComponent } from './components/modal-alert-actualizado/modal-alert-actualizado.component';
import { CardPescadorComponent } from './components/card-pescador/card-pescador.component';
import { CardPiscicultorComponent } from './components/card-piscicultor/card-piscicultor.component';
import { SearchBuscadorService } from './services/search-buscador.service';
import { ModalGallerySliderVerYElimanarFotosComponent } from './components/modal-gallery-slider-ver-y-elimanar-fotos/modal-gallery-slider-ver-y-elimanar-fotos.component';
import { NgxLongPress2Module } from 'ngx-long-press2';
import { ModalCheckboxListComponent } from './components/modal-checkbox-list/modal-checkbox-list.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { ChipConBotonCloseComponent } from './components/chip-con-boton-close/chip-con-boton-close.component';
import { FloatinBtnsAlanteAtrasComponent } from './components/floatin-btns-alante-atras/floatin-btns-alante-atras.component';



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
    CardAsociacionComponent,
    BasicFloatingBtnComponent,
    CardGranjasComponent,
    ModalAlertActualizadoComponent,
    CardPescadorComponent,
    CardPiscicultorComponent,
    ModalGallerySliderVerYElimanarFotosComponent,
    ModalCheckboxListComponent,
    FiltrosComponent,
    ChipConBotonCloseComponent,
    FloatinBtnsAlanteAtrasComponent,
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
    NgxLongPress2Module,
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
    CardAsociacionComponent,
    BasicFloatingBtnComponent,
    CardGranjasComponent,
    ModalAlertActualizadoComponent,
    CardPescadorComponent,
    CardPiscicultorComponent,
    ModalGallerySliderVerYElimanarFotosComponent,
    ModalCheckboxListComponent,
    FiltrosComponent,
    ChipConBotonCloseComponent,
    FloatinBtnsAlanteAtrasComponent,
    /*  CardphotoGoogleMapComponent, */
  ],

  providers: [
    ConfirmModalMapService,
    ModalGallerySliderService,
    GranjasService,
    ConfirmModalMapService,
    AppModalService,
    HttpsService,
    SearchBuscadorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
