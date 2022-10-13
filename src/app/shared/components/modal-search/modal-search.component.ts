import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent implements OnInit {
  constructor(private _modalService: NgbActiveModal) {}

  ngOnInit(): void {}
  public dismiss() {
    this._modalService.dismiss();
  }
}
