import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { ModalShareButtonComponent } from '../components/modal-share-button/modal-share-button.component';

@Injectable({
  providedIn: 'root',
})
export class AppModalService {
  constructor(private modalService: NgbModal) {}
  public closeModalShare(): void {
    this.modalService.dismissAll();
  }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Aceptar',
    btnCancelText: string = 'Cancelar',
    resourceId: string = ''): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.resourceId = resourceId;
    return modalRef.result;
  }
  public shared(
  titleheader: string,
  iconTicleheader:string,
  bodymessage: string,
  iconbodymessage:string,

  ): Promise<boolean> {
    const modalRef = this.modalService.open(ModalShareButtonComponent, {
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      centered: true,
    });
    modalRef.componentInstance.titleheader = titleheader;
    modalRef.componentInstance.iconTicleheader = iconTicleheader;
    modalRef.componentInstance.bodymessage = bodymessage;
    modalRef.componentInstance.iconbodymessage = iconbodymessage;
    return modalRef.result;
  }
}
