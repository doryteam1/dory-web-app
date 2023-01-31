import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
declare var window: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('offcanva') offcanva!: ElementRef;
  @ViewChild('botonalbondiga') botonalbondiga!: ElementRef;
  electronjs: boolean = false;
  mediaQuerySubscripNavbarThow!: Subscription;
  innerWidth: any[] = [];
  points: any[] = ['(min-width: 768px)', '(max-width:769px)'];
  minWidth: any[] = [];
  maxWidth: any[] = [];
  offcanvas: any;
  sidebar: boolean = false;
  OffCamba: boolean = false;
  /*  innerHeight:any=window.innerHeight */
  /* Fin */
  constructor(
    public router: Router,
    private _electronService: ElectronjsService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    public mediaQueryService: MediaQueryService,
    public userService: UsuarioService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.offcanva?.nativeElement.className.includes('show')) {
        if (
          !this.offcanva?.nativeElement.contains(e.target) &&
          !this.botonalbondiga?.nativeElement.contains(e.target)
        ) {
          this.closeOffcanvas();
        }
      }
    });

    this.breakpointObserver.observe(this.points).subscribe((result: any) => {
      this.maxWidth = [];
      this.minWidth = [];
      for (let index = 0; index < this.points.length; index++) {
        const element = this.points[index];
        if (this.points[index].includes('min-width')) {
          this.minWidth.push(result.breakpoints[element]);
        } else {
          this.maxWidth.push(result.breakpoints[element]);
        }
        if (this.minWidth[0]) {
           if (this.offcanva?.nativeElement.className.includes('show')) {
             this.renderer.removeClass(this.offcanva?.nativeElement, 'show');
             this.OffCamba = false;
           }
        }
      }
    });
  }

  ngOnInit(): void {
    this.electronjs = this._electronService.ipcActivo;
    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasScrollingx'),
      {
        backdrop: true,
      }
    );

  }
  openOffcanvas() {
    this.offcanvas.show();
    this.OffCamba = true;
  }
  closeOffcanvas() {
       if (this.offcanva?.nativeElement.className.includes('show')) {
         this.renderer.removeClass(this.offcanva?.nativeElement, 'show');
        }
        this.OffCamba = false;
  }

  validateRoute(route: string) {
    return this.router.url.includes(route);
  }

  navegarRuta(ruta: string) {
    this.ngZone.run(() => {
      this.router.navigateByUrl(ruta);
       this.closeOffcanvas();
    });
  }
  login() {
    this.ngZone.run(() => {
      this.router.navigateByUrl(this.authenticated() ? '/dashboard' : '/login');
      this.closeOffcanvas();
    });
  }
  authenticated() {
    return this.userService.isAuthenticated();
  }

  ngOnDestroy(): void {
    this.mediaQuerySubscripNavbarThow.unsubscribe();
  }
}
