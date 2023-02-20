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
import { BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { CalcHeightNavbarService } from 'src/app/services/calc-height-navbar.service';
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
  points: any[] = ['(min-width: 992px)', '(max-width:993px)'];
  minWidth: any;
  maxWidth: any[] = [];
  offcanvas: any;
  sidebar: boolean = false;
  OffCamba: boolean = false;
  heightNavbarSubsx!: Subscription;
  heightNavbar: any;
  /*  innerHeight:any=window.innerHeight */
  /* Fin */
  constructor(
    public router: Router,
    private _electronService: ElectronjsService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    public mediaQueryService: MediaQueryService,
    public userService: UsuarioService,
    private breakpointObserver: BreakpointObserver,
    public calcHeightNavbarService: CalcHeightNavbarService
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

    this.breakpointObserver.observe(this.points[0]).subscribe((result:BreakpointState) => {
      /* https://www.digitalocean.com/community/tutorials/angular-breakpoints-angular-cdk */
      this.minWidth = result.matches;
      if (this.minWidth) {
        this.closeOffcanvas();
      }
    });

    this.heightNavbarSubsx = this.calcHeightNavbarService.currentUser.subscribe(
      (height: any) => {
        this.heightNavbar = height;
      }
    );
  }

  ngOnInit(): void {
    this.electronjs = this._electronService.ipcActivo;
    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('navbarOffcanvasScrollingx'),
      {
        backdrop: false,
      }
    );
  }
  openOffcanvas() {
    if (this.offcanva?.nativeElement.className.includes('show')) {
      this.offcanvas.hide();
      this.OffCamba = false;
    } else {
      this.offcanvas.show();
      this.OffCamba = true;
    }
  }
  closeOffcanvas() {
    if (this.offcanva?.nativeElement.className.includes('show')) {
      this.offcanvas.hide();
      this.OffCamba = false;
    }
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
    this.heightNavbarSubsx.unsubscribe();
    this.mediaQuerySubscripNavbarThow.unsubscribe();
  }
}
