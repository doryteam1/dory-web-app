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
  fotos:any=[]
  @Input() set imagenes(photos: any[] | SafeUrl[]) {
    this.fotos = photos.filter((foto: any) => foto !== null);
  }

  @Input() imgselecmodal!: number;
  @Input() idtarge!: number;
  @Input() rounded: boolean = false;
  @Input() scale: boolean = false;
  @Input() efect: boolean = false;
  @Input() cover: boolean = false;
  @Input() scaledown: boolean = false;
  @Output() valueResponseIndiceActualSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickFotoMiniSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickDivIndicadorSlider: EventEmitter<any> =
    new EventEmitter();
  @Output() eventValueResponseclickImagenItemSlider: EventEmitter<any> =
    new EventEmitter();
  @Output() eventClickOnPreviousOrNew: EventEmitter<any> = new EventEmitter();
  @Output() eventClickImagen: EventEmitter<any> = new EventEmitter();
  id!: string;
  idnumeral!: string;
  widthExp: number = 0;
  valorlengthfotos!: number;
  idx!: number;
  justyfycentercontent: string = 'none';
  fotooverslider: boolean = false;
  ngOnInit(): void {
    this.id = `carouselExampleCaptions${this.idtarge}`;
    this.idnumeral = `#carouselExampleCaptions${this.idtarge}`;
    if (this.fotos.length > 4) {
      this.widthExp = 0;
    } else {
      this.justyfycentercontent = 'center';
    }
  }
  @HostListener('slide.bs.carousel', ['$event'])
  eventoSlideIndices(event: any) {
    this.idx = event.to + 1;
    this.valueResponseIndiceActualSlider.emit(event.to);
  }

  clickImgIndiceIndicadorSlide(index: number) {
    this.eventValueResponseClickFotoMiniSlider.emit(index);
    if (this.fotos.length > 9) {
      if (this.idx > 1 && this.idx <= this.fotos.length - 6) {
        let valores = this.idx - 1;
        this.widthExp = -(20 * valores);
      } else if (this.idx >= 1 && this.idx <= 4) {
        this.widthExp = 0;
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
    this.eventClickOnPreviousOrNew.emit();
    if (this.fotos.length > 4) {
      if (this.idx > 3 && this.idx <= this.fotos.length - 2) {
        let valores = this.idx - 3;
        this.widthExp = -(20 * valores);
      } else if (this.idx >= 1 && this.idx <= 4) {
        this.widthExp = 0;
      }
    }
  }
  clickButtonPrevious() {
    this.eventClickOnPreviousOrNew.emit();
    if (this.fotos.length > 4) {
      if (this.idx > 3 && this.idx <= this.fotos.length - 2) {
        let valores = this.idx - 3;
        this.widthExp = -(20 * valores);
      } else if (this.idx == this.fotos.length) {
        let valores = this.fotos.length - 5;
        this.widthExp = -(20 * valores);
      } else if (this.idx >= 1 && this.idx <= 4) {
        this.widthExp = 0;
      }
    }
  }
  clickImagen() {
    this.eventClickImagen.emit();
  }
  getImgClasses(
    length: number,
    rounded: boolean,
    scale: boolean,
    efect: boolean,
    cover: boolean,
    scaledown: boolean
  ): string {
    let classes = 'cursorPoin';
    if (length === 1 || length === 0) {
      classes += ' img1item';
    } else if (length > 1) {
      classes += ' img2item';
    }
    if (rounded) {
      classes += ' img1item--rounded';
    }
    if (scale) {
      classes += ' img1item--scale';
    }
    if (efect) {
      classes += ' img1item--efect';
    }
    if (cover) {
      classes += ' img1item--cover';
    }
    if (scaledown) {
      classes += ' img1item--scaledown';
    }
    return classes;
  }
}
