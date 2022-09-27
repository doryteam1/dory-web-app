import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { Subscription } from 'rxjs/internal/Subscription';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';
declare var window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tipoUsuario: string = '';
  error: string = '';
  offcanvas: any;
  MediaQuery!: Subscription;
  sidebar: boolean = false;
  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    public mediaQueryService: MediaQueryService
  ) {}

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
  }
  closeOffcanvas() {
    this.offcanvas.hide();
  }
}
