import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent implements OnInit {
  constructor(
    private _modalService: NgbActiveModal,
    private renderer: Renderer2
  ) {}
  @ViewChildren('Mycard') items!: QueryList<ElementRef>;
  mouseOverCart: boolean = false;
  idxCard: number = -1;
  ngOnInit(): void {}
  busqueda: any[] = [1, 2, 3, 4, 5, 6, 5, 6, 4, 8, 9];
  public dismiss() {
    this._modalService.dismiss();
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
}
