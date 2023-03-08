import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchIndexService } from 'src/app/services/search-index.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent implements OnInit {
  @ViewChildren('Mycard') items!: QueryList<ElementRef>;
  mouseOverCart: boolean = false;
  idxCard: number = -1;
  index: any[] = [];
  indexFiltered: any[] = [];
  baseUrl: string = environment.thisWebUrl;
  text: string = '';
  constructor(
    private _modalService: NgbActiveModal,
    private searchIdxService: SearchIndexService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchIdxService.getIndex().subscribe((response) => {
      this.index = response.data;
      this.indexFiltered = this.index.slice();
    });
  }

  public dismiss() {
    this._modalService.dismiss();
  }



  mouseoverCart(idx: number) {}

  onChange() {
    this.indexFiltered = this.index.filter((element) => {
      return element?.title?.toLowerCase().includes(this.text?.toLowerCase());
    });
  }
  goUrl(url: any) {
    this.router.navigateByUrl(`${url}`);
    this.dismiss();
  }
  borrarBusqueda() {
    this.text = '';
    this.onChange();
  }
}
