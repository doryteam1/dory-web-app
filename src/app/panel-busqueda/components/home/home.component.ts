import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { CalcHeightNavbarService } from 'src/app/services/calc-height-navbar.service';

declare var window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tipoUsuario: string = '';
  error: string = '';
  offcanvas: any;
  sidebar: boolean = false;
  closeOffCamba: boolean = false;
  MediaQuery!: Subscription;
  heightNavbar: any;
  heightNavbarSubs!: Subscription;
  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    public mediaQueryService: MediaQueryService,
    public calcHeightNavbarService: CalcHeightNavbarService
  ) {
       this.heightNavbarSubs = this.calcHeightNavbarService.currentUser.subscribe(
         (height: any) => {
           this.heightNavbar = height;
         }
       );
  }

  ngOnInit(): void {
    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasScrollingx'),
      {
        backdrop: true,
      }
    );
    this.MediaQuery = this.mediaQueryService
      .mediaQuery('max-width: 1000px')
      .subscribe((matches) => {
        if (matches) {
          this.sidebar = true;
        } else {
          this.closeOffcanvas();
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
              this.error = 'No se pudo iniciar sesión';
            }
          );
        });
      }
    }

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
  ngOnDestroy(): void {
    this.heightNavbarSubs.unsubscribe();
    this.MediaQuery.unsubscribe();
  }
}
