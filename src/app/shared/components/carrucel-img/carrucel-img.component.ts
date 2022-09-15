import { SafeUrl } from '@angular/platform-browser';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
} from '@angular/core';
@Component({
  selector: 'app-carrucel-img',
  templateUrl: './carrucel-img.component.html',
  styleUrls: ['./carrucel-img.component.scss'],
})
export class CarrucelImgComponent implements OnInit {
  @Input() imagenes: any | SafeUrl[] = [];
  @Input() imgselecmodal!: number;
  @Input() indicatorsphoto!: boolean;
  @Input() idtarge!: number;
  @Input() rounded: boolean = false;
  @Input() scale: boolean = false;
  @Input() efect: boolean = false;
  @Input() cover: boolean = false;
  @Input() scaledown: boolean = false;

  id!: string;
  idnumeral!: string;
  widthExp: number = 0;
  valorlengthfotos!: number;
  valorindiceactual!: number;
  posicionsliderleft!: string;
  posicionsliderleftindicatorssinfotos: string = 'relative';
  justyfycentercontent: string = 'none';
  fotooverslider: boolean = false;
  @Output() valueResponseIndiceActualSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickFotoMiniSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickDivIndicadorSlider: EventEmitter<any> =
    new EventEmitter();
  @Output() eventValueResponseclickImagenItemSlider: EventEmitter<any> =
    new EventEmitter();
  @Output() eventClickOnPreviousOrNew: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    if (this.indicatorsphoto) {
      this.id = `carouselExampleCaptions${this.idtarge}`;
      this.idnumeral = `#carouselExampleCaptions${this.idtarge}`;
      if (this.imagenes.length > 4) {
        this.widthExp = 0;
      } else {
        this.justyfycentercontent = 'center';
      }
    }
  }

  @HostListener('slide.bs.carousel', ['$event'])
  eventoSlideIndices(event: any) {
    if (this.indicatorsphoto) {
      this.valorindiceactual = event.to;
      this.valueResponseIndiceActualSlider.emit(event.to);
    }
  }

  clickImgIndiceIndicadorSlide(index: number) {
    if (this.indicatorsphoto) {
      this.eventValueResponseClickFotoMiniSlider.emit(index);
      if (this.imagenes.length > 9) {
        let idx = this.valorindiceactual + 1;
        if (idx > 1 && idx <= this.imagenes.length - 6) {
          let valores = idx - 1;
          this.widthExp = -(20 * valores);
        } else if (idx >= 1 && idx <= 4) {
          this.widthExp = 0;
        }
      }
    }
  }
  clickDivIndicadorSlider() {
    this.eventValueResponseClickDivIndicadorSlider.emit();
  }
  clickImagenItemSlider() {
    this.eventValueResponseclickImagenItemSlider.emit();
  }
  clickButtonNext() {
    if (this.indicatorsphoto) {
      let idx = this.valorindiceactual + 1;
      this.eventClickOnPreviousOrNew.emit();
      if (this.imagenes.length > 4) {
        if (idx > 3 && idx <= this.imagenes.length - 2) {
          let valores = idx - 3;
          this.widthExp = -(20 * valores);
        } else if (idx >= 1 && idx <= 4) {
          this.widthExp = 0;
        }
      }
    }
  }
  clickButtonPrevious() {
    if (this.indicatorsphoto) {
      let idx = this.valorindiceactual + 1;
      this.eventClickOnPreviousOrNew.emit();
      if (this.imagenes.length > 4) {
        if (idx > 3 && idx <= this.imagenes.length - 2) {
          let valores = idx - 3;
          this.widthExp = -(20 * valores);
        } else if (idx == this.imagenes.length) {
          let valores = this.imagenes.length - 5;
          this.widthExp = -(20 * valores);
        } else if (idx >= 1 && idx <= 4) {
          this.widthExp = 0;
        }
      }
    }
  }
}
