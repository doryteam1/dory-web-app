import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchIndexService } from 'src/app/services/search-index.service';
import { environment } from 'src/environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

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
    private renderer: Renderer2,
    private searchIdxService: SearchIndexService,
    private sanitizer: DomSanitizer
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

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  mouseoverCart(idx: number) {
    /*    if (idx == this.idxCard) {
      this.idxCard = -1;
    } else {
      this.idxCard = idx;
    } */
    /*    if (this.mouseOverCart) {
       this.mouseOverCart=false
    }else{
       this.mouseOverCart=true
    } */
    /*   console.log(
      this.items.forEach((item: ElementRef<any>, index: number) => {
        console.log(item);
      })
    ); */
    //     let valor = this.items?.get(idx);
    // console.log(valor)
    //     let card = valor?.nativeElement;
    //     if (card.className.includes('active')) {
    //       this.renderer.removeClass(card, 'active');
    //     } else {
    //    /*    this.mouseOverCart = true; */
    //       this.renderer.addClass(card, 'active');
    //     }
  }

  onChange() {
    console.log(this.text);
    this.indexFiltered = this.index.filter((element) => {
      return element?.title?.toLowerCase().includes(this.text?.toLowerCase());
    });
  }
  borrarBusqueda() {
    this.text = '';
    this.onChange()
  }
}
