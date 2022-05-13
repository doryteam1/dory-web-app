import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal-map',
  templateUrl: './confirm-modal-map.component.html',
  styleUrls: ['./confirm-modal-map.component.scss']
})
export class ConfirmModalMapComponent implements OnInit {
  @Input() iconTicle:string=""
  @Input() icon:string=""
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Esta seguro de completar esta acción?';
  @Input() btnOkText: string = 'Aceptar';
  @Input() btnCancelText: string = 'Cancelar';
  @Input() resourceId: string = '';

  constructor(private _modalService: NgbActiveModal) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  public decline(){
    this._modalService.close(false)
  }

  public accept(){
    this._modalService.close(true)
  }

  /* public dismiss(){
    this._modalService.dismiss()
  } */
}

