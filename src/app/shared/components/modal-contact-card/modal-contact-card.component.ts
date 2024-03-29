import { Component, ElementRef, Input, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-contact-card',
  templateUrl: './modal-contact-card.component.html',
  styleUrls: ['./modal-contact-card.component.scss'],
})
export class ModalContactCardComponent implements OnInit {
  @Input() datos: any;
  modalDetalle: boolean = true;
  constructor(private _modalService: NgbActiveModal, private router: Router) {}
  ngOnInit(): void {

  }
  navigateDetalle() {
    let url = '';
    url = this.router.serializeUrl(
      this.router.createUrlTree([this.datos.rutaUserDetalle])
    );
    window.open(url, '_blank');
  }
  public dismiss() {
    this._modalService.dismiss();
  }
}
