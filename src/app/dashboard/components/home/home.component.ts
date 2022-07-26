import { Component, HostBinding, OnInit , OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tipoUsuario: string = '';
  error: string = '';
  rutaGranjasdetalle: boolean = false;
  rutaAsociacionesdetalle:boolean=false
  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    private _router: Router
  ) {}

  public subscriber!: Subscription;
  ngOnInit(): void {

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
              this.error = 'No se pudo iniciar sessión';
            }
          );
        });
      }
    }
      let urlactiva = this._router.url;
      if (urlactiva.includes('/dashboard/granja/detalle')) {
        this.rutaGranjasdetalle = true;
      } else if (urlactiva.includes('/dashboard/asociacion/detalle')) {
        this.rutaAsociacionesdetalle = true;
      }
      this.subscriber = this._router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.rutaGranjasdetalle = false;
          this.rutaAsociacionesdetalle = false;
          let urlactiva = event.url;
          if (urlactiva.includes('/dashboard/granja/detalle')) {
            this.rutaGranjasdetalle = true;
            this.rutaAsociacionesdetalle = false;
          } else if (urlactiva.includes('/dashboard/asociacion/detalle')) {
            this.rutaAsociacionesdetalle = true;
            this.rutaGranjasdetalle = false;
          } else {
            this.rutaAsociacionesdetalle = false;
            this.rutaGranjasdetalle = false;
          }
        });
  }
  ngOnDestroy() {
    this.subscriber?.unsubscribe();
  }

}
