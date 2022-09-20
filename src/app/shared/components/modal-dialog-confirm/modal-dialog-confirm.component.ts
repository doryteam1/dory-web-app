import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-dialog-confirm',
  templateUrl: './modal-dialog-confirm.component.html',
  styleUrls: ['./modal-dialog-confirm.component.scss'],
})
export class ModalDialogConfirmComponent implements OnInit {
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Esta seguro de completar esta acción?';
  @Input() message2: string = '¿Esta seguro de completar esta acción?';
  @Input() btnOkText: string = 'Aceptar';
  @Input() btnCancelText: string = 'Cancelar';


  constructor(private _modalService: NgbActiveModal) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  public decline() {
    this._modalService.close('omitirAhora');
  }

  public accept() {
    this._modalService.close('si');
  }

  public dismiss() {
    this._modalService.dismiss('close');
  }
}
