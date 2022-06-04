import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGallerySliderComponent } from '../components/modal-gallery-slider/modal-gallery-slider.component';

@Injectable({
  providedIn: 'root',
})
export class ModalGallerySliderService {
  constructor(
    private modalService: NgbModal,
  ) {}
  public closeModal(): void{
     this.modalService.dismissAll()
  }
  public confirm(
    shadoweffectindice: number,
    imgselecmodal: number,
    valorindicecarrucel: number,
    showconteslaider: boolean,
    granja: any,
    fotosgranja: any = []
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ModalGallerySliderComponent, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-photo',
      scrollable: true,
      centered: true,
    });
    modalRef.componentInstance.shadoweffectindice = shadoweffectindice;
    modalRef.componentInstance.imgselecmodal = imgselecmodal;
    modalRef.componentInstance.valorindicecarrucel = valorindicecarrucel;
    modalRef.componentInstance.showconteslaider = showconteslaider;
    modalRef.componentInstance.granja = granja;
    modalRef.componentInstance.fotosgranja = fotosgranja;
    return modalRef.result;
  }
}


