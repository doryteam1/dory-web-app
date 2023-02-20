import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FloatingBtnComponent } from './components/floating-btn/floating-btn.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ControlBarComponent } from './control-bar/control-bar.component';
import { ModalGoogleGeneralComponent } from './components/modal-google-general/modal-google-general.component';
import { NgGallerySliderComponent } from './components/ng-gallery-slider/ng-gallery-slider.component';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ModalMultiFiltersComponent } from './components/filtros/modal-multi-filters/modal-multi-filters.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ModalContactCardComponent } from './components/modal-contact-card/modal-contact-card.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CardPublicacionComponent } from './components/card-publicacion/card-publicacion.component';
import { CardProductoComponent } from './components/card-producto/card-producto.component';
import { CardGeneralTresDComponent } from './components/card-general-tres-d/card-general-tres-d.component';
import { ModalSearchComponent } from './components/modal-search/modal-search.component';
import { CardNormatividadComponent } from './components/card-normatividad/card-normatividad.component';
import { CardSliderEnlacesDirectosInicioComponent } from './components/card-slider-enlaces-directos-inicio/card-slider-enlaces-directos-inicio.component';
import { CardVehiculoComponent } from './components/card-vehiculo/card-vehiculo.component';
import { CardNegocioComponent } from './components/card-negocio/card-negocio.component';
import { CardEventoComponent } from './components/card-evento/card-evento.component';
import { CardProveedorSimpleComponent } from './components/card-producto/card-proveedor-simple/card-proveedor-simple.component';
import { ReloadStateAuthDirective } from './directives/reload-state-auth.directive';
import { CardGranjaSimpleComponent } from './components/card-granjas/card-granja-simple/card-granja-simple.component';
import { ModalAlertSignupComponent } from './components/modal-alert-signup/modal-alert-signup.component';
import { SimpleCheckboxSwitchComponent } from './components/simple-checkbox-switch/simple-checkbox-switch.component';
import { ModalInsertLinkComponent } from './components/modal-insert-link/modal-insert-link.component';
import { TargetDesplegableComponent } from './components/target-desplegable/target-desplegable.component';
import { LightboxImagenComponent } from './components/lightbox-imagen/lightbox-imagen.component';
import { CardItemDataComponent } from './components/card-item-data/card-item-data.component';
import { LinkCardComponent } from './components/link-card/link-card.component';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductDetailsCardTemplateComponent } from './components/product-details-card-template/product-details-card-template.component';
import { ButtonChatOpenComponent } from './components/button-chat-open/button-chat-open.component';
import { VideoEmbedIframeComponent } from './components/video-embed-iframe/video-embed-iframe.component';
import { ModalAlertErrorComponent } from './components/modal-alert-error/modal-alert-error.component';


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
    CarrucelImgComponent,
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
    ControlBarComponent,
    ModalGoogleGeneralComponent,
    ModalMultiFiltersComponent,
    NgGallerySliderComponent,
    NotFoundComponent,
    ModalContactCardComponent,
    SpinnerComponent,
    CardPublicacionComponent,
    CardProductoComponent,
    CardGeneralTresDComponent,
    ModalSearchComponent,
    CardNormatividadComponent,
    CardSliderEnlacesDirectosInicioComponent,
    CardVehiculoComponent,
    CardNegocioComponent,
    CardEventoComponent,
    CardProveedorSimpleComponent,
    ReloadStateAuthDirective,
    CardGranjaSimpleComponent,
    ModalAlertSignupComponent,
    SimpleCheckboxSwitchComponent,
    ModalInsertLinkComponent,
    TargetDesplegableComponent,
    LightboxImagenComponent,
    CardItemDataComponent,
    LinkCardComponent,
    ProductDetailsCardTemplateComponent,
    ButtonChatOpenComponent,
    VideoEmbedIframeComponent,
    ModalAlertErrorComponent,
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
    ReactiveFormsModule,
    GalleryModule,
    LightboxModule,
    NgxSkeletonLoaderModule,
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
    ControlBarComponent,
    ModalGoogleGeneralComponent,
    ModalMultiFiltersComponent,
    NgGallerySliderComponent,
    NotFoundComponent,
    ModalContactCardComponent,
    SpinnerComponent,
    CardPublicacionComponent,
    CardProductoComponent,
    CardGeneralTresDComponent,
    ModalSearchComponent,
    CardNormatividadComponent,
    CardSliderEnlacesDirectosInicioComponent,
    CardVehiculoComponent,
    CardNegocioComponent,
    CardEventoComponent,
    CardProveedorSimpleComponent,
    ReloadStateAuthDirective,
    CardGranjaSimpleComponent,
    SimpleCheckboxSwitchComponent,
    ModalInsertLinkComponent,
    TargetDesplegableComponent,
    LightboxImagenComponent,
    CardItemDataComponent,
    LinkCardComponent,
    ProductDetailsCardTemplateComponent,
    ButtonChatOpenComponent,
    VideoEmbedIframeComponent,
  ],

  providers: [
    ConfirmModalMapService,
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
