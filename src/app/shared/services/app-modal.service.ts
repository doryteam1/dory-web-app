import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { ModalShareButtonComponent } from '../components/modal-share-button/modal-share-button.component';
import { ModalGoogleMapComponent } from '../components/modal-google-map/modal-google-map.component';
import { ModalAlertActualizadoComponent } from '../components/modal-alert-actualizado/modal-alert-actualizado.component';
import { ModalCheckboxListComponent} from '../components/modal-checkbox-list/modal-checkbox-list.component'
import { ModalGallerySliderVerYElimanarFotosComponent } from '../components/modal-gallery-slider-ver-y-elimanar-fotos/modal-gallery-slider-ver-y-elimanar-fotos.component';
import { ModalGoogleGeneralComponent } from '../components/modal-google-general/modal-google-general.component';

import { SafeUrl } from '@angular/platform-browser';
interface atributos {
  nameButton: string;
  nombrecampoDB: string | null;
  modoFiltro: string | null;
  titulomodal: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppModalService {
  constructor(private modalService: NgbModal) {}
  /* modal confirmar click */
  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Aceptar',
    btnCancelText: string = 'Cancelar',
    resourceId: string = ''
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.resourceId = resourceId;
    return modalRef.result;
  }
  /* modal shared */
  public closeModalShare(): void {
    this.modalService.dismissAll();
  }
  public shared(
    titleheader: string,
    url: boolean,
    urllink: string,
    bodymessage: string
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ModalShareButtonComponent, {
      centered: true,
      backdropClass: 'miestilofondosharedmodal',
    });
    modalRef.componentInstance.titleheader = titleheader;
    modalRef.componentInstance.url = url;
    modalRef.componentInstance.urllink = urllink;
    modalRef.componentInstance.bodymessage = bodymessage;
    return modalRef.result;
  }
  /* modal google map */
  public CloseGoogleMapModal(): void {
    this.modalService.dismissAll();
  }
  public GoogleMapModal(
    atributos: any = {},
    modalheader: boolean,
    shared: boolean,
    iconMarkerGoogleMap: string,
    iconMarkerGoogleMap2: string
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ModalGoogleMapComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.atributos = atributos;
    modalRef.componentInstance.modalheader = modalheader;
    modalRef.componentInstance.shared = shared;
    modalRef.componentInstance.iconMarkerGoogleMap = iconMarkerGoogleMap;
    modalRef.componentInstance.iconMarkerGoogleMap2 = iconMarkerGoogleMap2;
    return modalRef.dismissed.toPromise();
  }
  /* modal google map general */
  public CloseGoogleMapGeneralModal(): void {
    this.modalService.dismissAll();
  }
  public GoogleMapModalGeneral(
    atributos: any = {},
    modalheader: boolean,
    iconMarkerGoogleMap: string,
    shared?: boolean
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ModalGoogleGeneralComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.atributos = atributos;
    modalRef.componentInstance.modalheader = modalheader;
    modalRef.componentInstance.iconMarkerGoogleMap = iconMarkerGoogleMap;
    modalRef.componentInstance.shared = shared;
    return modalRef.dismissed.toPromise();
  }
  /* alerta modal perfil actualizado */
  public closeModalAlertActualizadoComponent(): void {
    this.modalService.dismissAll();
  }
  public modalAlertActualizadoComponent(mensaje: string): Promise<boolean> {
    const modalRef = this.modalService.open(ModalAlertActualizadoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm',
      centered: true,
    });
    modalRef.componentInstance.mensaje = mensaje;

    return modalRef.dismissed.toPromise();
  }

  /* modal gallery slider ver y adicionar y eleimar fotos */
  public CloseModalGalleryVerAdiconarEliminarFotos(): void {
    this.modalService.dismissAll();
  }
  public modalGalleryVerAdiconarEliminarFoto(
    /*
    si solo se va a visualizar es obligatorio
    pasar :ArrayFotos
    si necesitas el slider es obligatorio
    pasar:showconteslaider, como true
    para las otras variables no son obligartorias:
    shadoweffectindice: como -1,
    imgselecmodal: como-1
    valorindicecarrucel: como -1
    arrayConAtributos: puede ser un array con algunas propiedades
    es obligatorio pasar lo que quieres hacer por ejempli ver o adicionar fotos
    si quieres solo ver: veryadiciona:false
    si quieres ver y adicionar :veryadiciona:true

    */
    shadoweffectindice: number,
    imgselecmodal: number,
    valorindicecarrucel: number,
    showconteslaider: boolean,
    veryadicionar: boolean,
    ArrayFotos: Array<string | SafeUrl> = [],
    ArrayFiles: any,
    action: string
  ): Promise<boolean> {
    const modalRef = this.modalService.open(
      ModalGallerySliderVerYElimanarFotosComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-photo',
        centered: true,
        /*         backdrop: 'static',
        keyboard: false, */
        scrollable: true,
      }
    );
    modalRef.componentInstance.shadoweffectindice = shadoweffectindice;
    modalRef.componentInstance.imgselecmodal = imgselecmodal;
    modalRef.componentInstance.valorindicecarrucel = valorindicecarrucel;
    modalRef.componentInstance.showconteslaider = showconteslaider;
    modalRef.componentInstance.veryadicionar = veryadicionar;
    modalRef.componentInstance.ArrayFotos = ArrayFotos;
    modalRef.componentInstance.ArrayFiles = ArrayFiles;
    modalRef.componentInstance.action = action;
    return modalRef.dismissed.toPromise();
  }
  /* modal checkboxlist*/
  public closeModalCheckboxListComponent(): void {
    this.modalService.dismissAll();
  }
  public modalCheckboxListComponent(
    arrayCheckbox: any[],
    arrayCheckboxSelec: any[],
    titleModal: string
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ModalCheckboxListComponent, {
      size: 'md',
      centered: true,
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.arrayCheckbox = arrayCheckbox;
    modalRef.componentInstance.arrayCheckboxSelec = arrayCheckboxSelec;
    modalRef.componentInstance.titleModal = titleModal;
    return modalRef.dismissed.toPromise();
  }
}
