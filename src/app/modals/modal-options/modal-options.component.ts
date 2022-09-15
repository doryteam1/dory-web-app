import { Component} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-options',
  templateUrl: './modal-options.component.html',
  styleUrls: ['./modal-options.component.scss']
})
export class NgbdModalOptions {
  closeResult: string = '';
  constructor(private modalService: NgbModal) {}
  openScrollableContent(longContent:any) {
    this.modalService.open(longContent, { scrollable: true });
  }
}
