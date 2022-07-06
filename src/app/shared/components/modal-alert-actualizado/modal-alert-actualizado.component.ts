import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-alert-actualizado',
  templateUrl: './modal-alert-actualizado.component.html',
  styleUrls: ['./modal-alert-actualizado.component.scss'],
})
export class ModalAlertActualizadoComponent implements OnInit {
  ngOnInit(): void {}

  @Input() mensaje: string = '';
  constructor(private _modalService: NgbActiveModal) {}
  public decline() {
    this._modalService.close(false);
  }
  public accept() {
    this._modalService.close(true);
  }
  public dismiss(){
    this._modalService.dismiss()
  }
}
