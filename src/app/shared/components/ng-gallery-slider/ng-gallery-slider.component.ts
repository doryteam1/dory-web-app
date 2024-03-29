import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Gallery, GalleryItem, ImageItem, GalleryRef } from 'ng-gallery';

@Component({
  selector: 'app-ng-gallery-slider',
  templateUrl: './ng-gallery-slider.component.html',
  styleUrls: ['./ng-gallery-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgGallerySliderComponent implements OnInit {
  @Output() valueResponseIndiceActualSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickFotoMiniSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventClickOnPreviousOrNew: EventEmitter<any> = new EventEmitter();
  @Input() imagenes: any | SafeUrl = [];
  @Input() fullScreen: boolean = false;
  @Input() contador: boolean = true;
  @Input() puntos: boolean = false;
  @Input() imgMini: boolean = true;
  @Input() nave: boolean = true;
  @Input() activateStyle: boolean = false;
  @Input() imageSiz: any = 'contain';
  @Input() autoPlay: any = {
    autoPlay: false,
    time: 3000,
  };
  @Input() imgselecmodal: number = 0;
  @Input() id: any = 'basic-test';
  items!: GalleryItem[];
  imageData: any[] = [];
  reseteSlider: boolean = false;
  lightboxRef!: GalleryRef;
  counter: number = 0;
  setIntervalFoto: any;
  percent: number = 0;
  ngOnChanges(changes: SimpleChanges) {
    if (changes.imagenes) {
      this.imagenes.forEach((element: any) => {
        this.imageData.push({
          srcUrl: element.changingThisBreaksApplicationSecurity || element,
          previewUrl: element.changingThisBreaksApplicationSecurity || element,
          title: '',
        });
      });
      this.items = this.imageData.map(
        (item) => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
      );
    }
  }
  constructor(public gallery: Gallery) {}

  ngOnInit() {
    this.lightboxRef = this.gallery.ref(this.id);
    this.lightboxRef.set(this.imgselecmodal);
  }
  nex() {
    this.lightboxRef.next();
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    /* console.log(event); */
    if (event.key === 'ArrowRight') {
      this.lightboxRef.next();
    } else if (event.key === 'ArrowLeft') {
      this.lightboxRef.prev();
    }
  }
  indexFoto(event: any) {
    this.valueResponseIndiceActualSlider.emit(event.currIndex);
  }
  clickImgMiniatura(event: any) {
    this.eventValueResponseClickFotoMiniSlider.emit(event);
  }
  itemsChange(event: any) {
    if (this.imgselecmodal == this.imageData.length - 1) {
      event.hasNext = false;
      event.hasPrev = true;
    } else if (this.imgselecmodal == 0) {
      event.hasNext = true;
      event.hasPrev = false;
    } else {
      event.hasPrev = true;
    }
  }
}
