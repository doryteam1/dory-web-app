import { Component, OnInit, Inject, HostListener, Input, ElementRef, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-floating-btn-auto-up',
  templateUrl: './floating-btn-auto-up.component.html',
  styleUrls: ['./floating-btn-auto-up.component.scss'],
})
export class FloatingBtnAutoUpComponent implements OnInit {
  @HostBinding('hidden')
  isHidden: boolean = false;
  @Input() parentContainer: ElementRef | undefined;
  windowScrolled: boolean | undefined;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }
  scrollToBottom(): void {
    (function smoothscroll() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    })();
  }

  onScrollContainer(scrollTop: number) {
    if (scrollTop || scrollTop > 100) {
      this.windowScrolled = true;
    } else if (scrollTop || scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToBottomContainer(): void {
    console.log(this.parentContainer);
    this.parentContainer!.nativeElement!.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

  restartScroll() {
    if (!this.parentContainer) {
      this.scrollToBottom();
    } else {
      this.scrollToBottomContainer();
    }
  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route: string = event.url;
        if (
          route.includes('asociaciones') ||
          route.includes('novedades/') ||
          route.includes('eventos/') ||
          route.includes('normatividad/') ||
          route.includes('equipo') ||
          route.includes('nosotros') ||
          route.includes('pescadores') ||
          route.includes('granjas') ||
          route.includes('piscicultores') ||
          route.includes('dashboard/mis-favoritos') ||
          route.includes('home') ||
          route.includes('panel-busqueda/productos') ||
          route.includes('panel-busqueda/vehiculos') ||
          route.includes('panel-busqueda/negocios')
        ) {
          this.isHidden = false;
          if (
            route.includes('/dashboard/granjas') ||
            route.includes('dashboard/mis-asociaciones') ||
            route.includes('panel-busqueda/asociaciones') ||
            route.includes('panel-busqueda/pescadores') ||
            route.includes('panel-busqueda/piscicultores') ||
            route.includes('panel-busqueda/granjas')
          ) {
            this.isHidden = true;
          }
        } else {
          this.isHidden = true;
        }
      }
    });
  }
}
