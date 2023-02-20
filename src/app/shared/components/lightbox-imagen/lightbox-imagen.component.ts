import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2,ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalcHeightNavbarService } from 'src/app/services/calc-height-navbar.service';

@Component({
  selector: 'app-lightbox-imagen',
  templateUrl: './lightbox-imagen.component.html',
  styleUrls: ['./lightbox-imagen.component.scss'],
})
export class LightboxImagenComponent implements OnInit {
  @Input() thumbnails: string = '';
  @Output() onCloseLightbox: EventEmitter<number> = new EventEmitter();
  @ViewChild('lightboximage', { static: true }) lightboxImage!: ElementRef;
  @ViewChild('lightbox', { static: true }) lightbox!: ElementRef;
  electronActive: any = window.require;
  subsHeightNavbar!: Subscription;
  heightNavbar: any;
  constructor(
    private renderer: Renderer2,
    public calcHeightNavbarService: CalcHeightNavbarService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      const lightboxImageContainsTarget =
        this.lightboxImage?.nativeElement.contains(e.target);
      const lightboxContainsTarget = this.lightbox?.nativeElement.contains(
        e.target
      );
      if (!lightboxImageContainsTarget && lightboxContainsTarget) {
        this.onCloseLightbox.emit();
      }
    });
    this.subsHeightNavbar = this.calcHeightNavbarService.currentUser.subscribe(
      (height: any) => {
        this.heightNavbar = height;
      }
    );
  }

  ngOnInit(): void {}

  closeLightbox() {
    this.onCloseLightbox.emit();
  }
}
