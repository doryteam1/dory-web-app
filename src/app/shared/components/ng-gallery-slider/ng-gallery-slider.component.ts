import { Component, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import {
  Gallery,
  GalleryItem,
  ImageItem,
} from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

@Component({
  selector: 'app-ng-gallery-slider',
  templateUrl: './ng-gallery-slider.component.html',
  styleUrls: ['./ng-gallery-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgGallerySliderComponent implements OnInit {
  @ViewChild('itemTemplate', { static: true }) itemTemplate!: TemplateRef<any>;
  @Output() valueResponseIndiceActualSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickFotoMiniSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventClickOnPreviousOrNew: EventEmitter<any> = new EventEmitter();
  @Input() imagenes: any | SafeUrl = [];
  @Input() imgselecmodal!: number;
  items!: GalleryItem[];
  imageData: any[] = [];
  reseteSlider: boolean = false;

  constructor(public gallery: Gallery, public lightbox: Lightbox) {}

  ngOnInit() {
    console.log(this.imgselecmodal);
    this.imagenes.forEach((element: any) => {
      this.imageData.push({
        srcUrl: element.changingThisBreaksApplicationSecurity || element,
        previewUrl: element.changingThisBreaksApplicationSecurity || element,
      });
    });
    this.items = this.imageData.map(
      (item) => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
    );
    const lightboxRef = this.gallery.ref('basic-test');
    lightboxRef.set(this.imgselecmodal);
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

