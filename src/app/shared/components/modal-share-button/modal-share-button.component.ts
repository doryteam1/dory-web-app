
  import { Component, Input, OnInit } from '@angular/core';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-share-button',
  templateUrl: './modal-share-button.component.html',
  styleUrls: ['./modal-share-button.component.scss'],
})
export class ModalShareButtonComponent {
  @Input() titleheader: string = '';
  @Input() url: boolean = false;
  @Input() urllink: string = '';
  @Input() bodymessage: string = '';
  constructor(private _modalService: NgbActiveModal) {}
  public decline() {
    this._modalService.close(false);
  }
  public accept() {
    this._modalService.close(true);
  }
  /* public dismiss(){
    this._modalService.dismiss()
  } */
}
