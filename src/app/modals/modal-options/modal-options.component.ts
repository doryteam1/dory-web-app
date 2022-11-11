import { Component} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ngbd-modal-options',
  templateUrl: './modal-options.component.html',
  styleUrls: ['./modal-options.component.scss']
})
export class NgbdModalOptions {
  closeResult: string = '';
  baseUrl:string = environment.thisWebUrl;
  constructor(private modalService: NgbModal) {}
  openScrollableContent(longContent:any) {
    this.modalService.open(longContent, { scrollable: true });
  }
}
