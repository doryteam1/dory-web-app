
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-alert-signup',
  templateUrl: './modal-alert-signup.component.html',
  styleUrls: ['./modal-alert-signup.component.scss'],
})
export class ModalAlertSignupComponent implements OnInit {
  @Input() btn1: string = 'Registrarme';
  @Input() btn2: string = 'Ingresar';
  @Input() message: string = '';
  @Input() modal: number = 1;
  constructor(private _modalService: NgbActiveModal) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  public ingresar() {
    this._modalService.close('ingresar');
  }

  public registrate() {
    this._modalService.close('registrate');
  }
  public logout() {
    this._modalService.close('logout');
  }

  public continuar() {
    this._modalService.close('continuar');
  }

  public dismiss() {
    this._modalService.dismiss();
  }
}
