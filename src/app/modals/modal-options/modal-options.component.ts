import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-options',
  templateUrl: './modal-options.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./modal-options.component.scss']
})
export class NgbdModalOptions {
  closeResult: string = '';

  constructor(private modalService: NgbModal) {}

  openBackDropCustomClass(content:any) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  openWindowCustomClass(content:any) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  openSm(content:any) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content:any) {
    this.modalService.open(content, { size: 'lg' });
  }

  openXl(content:any) {
    this.modalService.open(content, { size: 'xl' });
  }

  openVerticallyCentered(content:any) {
    this.modalService.open(content, { centered: true });
  }

  openScrollableContent(longContent:any) {
    this.modalService.open(longContent, { scrollable: true });
  }

  openModalDialogCustomClass(content:any) {
    this.modalService.open(content, { modalDialogClass: 'dark-modal' });
  }
}
