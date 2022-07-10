import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { ModalShareButtonComponent } from '../components/modal-share-button/modal-share-button.component';
import { ModalGoogleMapComponent } from '../components/modal-google-map/modal-google-map.component';
import { ModalAlertActualizadoComponent } from '../components/modal-alert-actualizado/modal-alert-actualizado.component';
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
    mapElementVarios: boolean,
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
    modalRef.componentInstance.mapElementVarios = mapElementVarios;
    modalRef.componentInstance.iconMarkerGoogleMap = iconMarkerGoogleMap;
    modalRef.componentInstance.iconMarkerGoogleMap2 = iconMarkerGoogleMap2;
    return modalRef.dismissed.toPromise();
  }
  /* alerta modal perfil actualizado */
  public closeModalAlertActualizadoComponent(): void {
    this.modalService.dismissAll();
  }
  public modalAlertActualizadoComponent(
    mensaje: string
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ModalAlertActualizadoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm',
      centered: true,
    });
    modalRef.componentInstance.mensaje = mensaje;
    return modalRef.dismissed.toPromise();
  }
}
