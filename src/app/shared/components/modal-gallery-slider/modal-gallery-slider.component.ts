

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ElementRef } from '@angular/core';
@Component({
  selector: 'app-modal-gallery-slider',
  templateUrl: './modal-gallery-slider.component.html',
  styleUrls: ['./modal-gallery-slider.component.scss'],
})
export class ModalGallerySliderComponent  {
  @ViewChildren('myItemLists') items!: QueryList<ElementRef>;
  @Input() shadoweffectindice!: number;
  @Input() imgselecmodal!: number;
  @Input() valorindicecarrucel!: number;
  @Input() showconteslaider!: boolean;
  @Input() granja: any;
  @Input() fotosgranja: any = [];
  showNotFound: boolean = false;
  showError: boolean = false;
  selectedGranjaId: number = -1;
  errorMessage = '';
  showGallery: boolean = false;
  indx!: number;
  indicatorsphotos!: boolean;
  valorrows: number = 44.499975;
  valorcolumns: number = 98.5;
  /* @Output() indicatorsphotos: boolean = true; */
  constructor(
    private _modalService: NgbActiveModal,
  ) {}

  public decline() {
    this._modalService.close(false);
  }

  public accept() {
    this._modalService.close(true);
  }

  public dismiss() {
    this._modalService.dismiss();
  }
  imgSelecionadaModal(i: number, granja: any) {
    this.imgselecmodal = i;
    this.shadoweffectindice = -1;
    this.valorindicecarrucel = -1;
    this.showconteslaider = true;
    localStorage.setItem('index', i.toString());
  }
  closeslider() {
    this.showconteslaider = false;
    setTimeout(() => {
      const scrollmover = localStorage.getItem('index');
      this.inView(Number(scrollmover));
    }, 10);
    setTimeout(() => {
      localStorage.removeItem('index');
    }, 11);

  }

  selcCarruselImg(idx: number) {
    this.valorindicecarrucel = idx;
    localStorage.setItem('index', idx.toString());
  }
  eventClickOnPreviousOrNewSlider() {
    this.imgselecmodal = -1;
  }
  eventValueResponseClickFotoMiniSlider(index: number) {
    this.indx = index;
    localStorage.setItem('index', index.toString());
    if (this.imgselecmodal !== index) {
      this.imgselecmodal = -1;
    }
  }
  inView(index: number) {
      let valor = this.items.get(index);
    valor?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }
}

