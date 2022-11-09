import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-insert-link',
  templateUrl: './modal-insert-link.component.html',
  styleUrls: ['./modal-insert-link.component.scss'],
})
export class ModalInsertLinkComponent implements OnInit {
  @Input() url!: string;
  constructor(private _modalService: NgbActiveModal) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  public cancelar() {
    this._modalService.dismiss();
  }

  public aceptar() {
    this._modalService.close(this.url);
  }

  public dismiss() {
    this._modalService.dismiss();
  }
}
