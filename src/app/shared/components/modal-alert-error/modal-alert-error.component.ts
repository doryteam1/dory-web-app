import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-alert-error',
  templateUrl: './modal-alert-error.component.html',
  styleUrls: ['./modal-alert-error.component.scss'],
})
export class ModalAlertErrorComponent implements OnInit {
  @Input() btn1: string = '';
  @Input() btn2: string = '';
  @Input() message: string = '';
  constructor(private _modalService: NgbActiveModal) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  public boton1() {
    this._modalService.close(this.btn1);
  }

  public boton2() {
    this._modalService.close(this.btn2);
  }

  public dismiss() {
    this._modalService.dismiss();
  }
}
