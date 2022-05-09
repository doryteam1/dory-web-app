import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalMapComponent } from '../components/confirm-modal-map/confirm-modal-map.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalMapService {

  constructor(private modalService:NgbModal) { }

  public confirm(
    iconTicle:string,
    icon:string,
    title: string,
    message: string,
    btnOkText: string = 'Aceptar',
    btnCancelText: string = 'Cancelar',
    resourceId: string = ''): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalMapComponent);
    modalRef.componentInstance.icon=icon;
    modalRef.componentInstance.iconTicle=iconTicle;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.resourceId = resourceId;
    return modalRef.result;
  }
}
