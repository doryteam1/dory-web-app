import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { CalcHeightNavbarService } from 'src/app/services/calc-height-navbar.service';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { IntrojsService } from 'src/app/services/introjs.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';
import { guidedTours } from 'src/app/global/tour-steps-intros';
import { IntroGuidedTour, IntroToursteps } from 'src/models/introJsTourt.model';
declare var window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dropdownNotificacion')
  heightNavbarSubss!: Subscription;
  dropdownNotificacion!: ElementRef<HTMLElement>;
  authUser: any;
  tipoUsuario: string = '';
  error: string = '';
  offcanvas: any;
  sidebar: boolean = false;
  closeOffCamba: boolean = false;
  disableTags: boolean = false;
  electronActivo: boolean = false;
  heightNavbar: any;
  subscriber!: Subscription;
  MediaQuery!: Subscription;
  elementoActivoTour!: Subscription;
  onCompleteTourt!: Subscription;
  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    public _router: Router,
    private storage: StorageService,
    private us: UsuarioService,
    public mediaQueryService: MediaQueryService,
    private introService: IntrojsService,
    private _electronService: ElectronjsService,
    public calcHeightNavbarService: CalcHeightNavbarService
  ) {
    this.heightNavbarSubss = this.calcHeightNavbarService.currentUser.subscribe(
      (height: any) => {
        this.heightNavbar = height;
      }
    );
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url !== '/dashboard/perfil') {
          this.introService.closeIntroJs()
        }
      }
    });
  }

  ngAfterViewInit(): void {
    let email = localStorage.getItem('email');
    this.us.getUsuarioByEmail(email).subscribe((response) => {
      this.authUser = response.data[0];
      if (this._router.url.includes('/dashboard/perfil')) {
        if (!this.authUser.takeTour) {
          if (this.sidebar) {
            this.openOffcanvas();
            this.starTour();
          } else {
            this.starTour();
          }
        } else if (!this.authUser.celular) {
          this.introService.miniTour(guidedTours.miniGuidedCelularTour);
        } else if (!this.authUser.id_municipio) {
          this.introService.miniTour(guidedTours.miniGuidedMunicipioTour);
        } else if (!this.authUser.direccion) {
          this.introService.miniTour(guidedTours.miniGuidedDirecTour);
        }
      }
    });
  }
  ngOnInit(): void {
    this.electronActivo = this._electronService.ipcActivo;
    this.elementoActivoTour = this.introService.onElementoActivoTour.subscribe(
      (elemento: any) => {
        if (this.sidebar && elemento.id == 'basicos' && !this.closeOffCamba) {
          this.closeOffcanvas();
        }
      }
    );
    this.onCompleteTourt = this.introService.onCompleteTourt.subscribe(
      (elemento: any) => {
        if (elemento) {
          console.log('Tourt completo');
          this.onFinishTour();
        }
      }
    );
    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasScrolling'),
      {
        backdrop: true,
      }
    );

    this.MediaQuery = this.mediaQueryService
      .mediaQuery('max-width: 1000px')
      .subscribe((matches) => {
        if (matches) {
          this.sidebar = true;
          this.introService.closeIntroJs();
        } else {
          this.closeOffcanvas();
          this.introService.closeIntroJs();
          this.sidebar = false;
        }
      });
    let token = localStorage.getItem('token');
    if (token && token != 'undefined') {
      this.tipoUsuario = Utilities.parseJwt(token!).rol;
      if (
        !this.tipoUsuario &&
        this.userService.authenticatedWith() == 'google'
      ) {
        this.socialService.authState.subscribe((response) => {
          let idToken = response.idToken;
          this.userService.loginWithGoogle(idToken).subscribe(
            (response) => {
              localStorage.setItem('token', response.body.token);
              this.userService.setAuthWith('google');
              this.tipoUsuario = Utilities.parseJwt(response.body.token).rol;
            },
            (err) => {
              console.log(err);
              this.error = 'No se pudoIniciar sesión';
            }
          );
        });
      }
    }
  }
  ngOnDestroy() {
    this.subscriber?.unsubscribe();
    this.MediaQuery.unsubscribe();
    this.onCompleteTourt.unsubscribe();
    this.elementoActivoTour.unsubscribe();
  }
  openOffcanvas() {
    this.offcanvas.show();
    this.closeOffCamba = false;
  }
  closeOffcanvas() {
    if (this.sidebar) {
      this.offcanvas.hide();
      this.closeOffCamba = true;
    }
  }
  starTour() {
    if (this._router.url.includes('/dashboard/perfil')) {
      if (this.tipoUsuario) {
        if (this.tipoUsuario == 'Piscicultor') {
          this.introService.tourPrincipal(guidedTours.piscicultorGuidedTour);
        } else if (this.tipoUsuario == 'Pescador') {
          this.introService.tourPrincipal(guidedTours.pescadorGuidedTour);
        } else if (this.tipoUsuario == 'Proveedor') {
          this.introService.tourPrincipal(guidedTours.proveedorGuidedTour);
        } else if (this.tipoUsuario == 'Transportador') {
          this.introService.tourPrincipal(guidedTours.transportadorGuidedTour);
        } else if (this.tipoUsuario == 'Investigador Experto') {
          this.introService.tourPrincipal(guidedTours.investigadorGuidedTour);
        } else if (this.tipoUsuario == 'Consumidor') {
          this.introService.tourPrincipal(guidedTours.consumidorGuidedTour);
        } else if (this.tipoUsuario == 'Comerciante') {
          this.introService.tourPrincipal(guidedTours.comercianteGuidedTour);
        }
      }
    }
  }

  onFinishTour() {
    this.userService
      .actualizarUsuario(this.authUser.id, { takeTour: 1 })
      .subscribe(
        () => {},
        (err) => {}
      );
    if (this._router.url.includes('/dashboard/perfil')) {
      setTimeout(() => {
        if (!this.authUser.celular) {
          /* this.disableTags = true; */
          this.introService.miniTour(guidedTours.miniGuidedCelularTour);
        } else if (!this.authUser.id_municipio) {
          /* this.disableTags = true; */
          this.introService.miniTour(guidedTours.miniGuidedMunicipioTour);
        } else if (!this.authUser.direccion) {
          /*  this.disableTags = true; */
          this.introService.miniTour(guidedTours.miniGuidedDirecTour);
        }
      }, 1000);
    }
  }

  takedTour() {
    return this.storage.get('takeTour');
  }

  logout() {
    if (this.electronActivo) {
      this.userService.logoutElectron();
    } else {
      this.userService.logout();
    }
    this._router.navigateByUrl('/home');
  }
}
