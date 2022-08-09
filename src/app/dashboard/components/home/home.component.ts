import { Component, OnInit , OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { Orientation, OrientationConfiguration,GuidedTour, TourStep, GuidedTourService } from 'ngx-guided-tour';
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
  step1 : TourStep = {
    selector : '#menuOptions',
    title : 'Menú principal',
    content : '<p> Aqui encontrarás todo lo que puedes realizar con tu cuenta </p>',
    orientation : Orientation.Right,
  }

  step2 : TourStep = {
    selector : '#perfil',
    title : 'Perfil',
    content : '<p> En este formulario podras llenar toda tu información para que puedan entontrarte </p>',
    orientation : Orientation.Right,
  }

  step3 : TourStep = {
    selector : '#misgranjas',
    title : 'Mis granjas',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de tus granjas piscicolas </p>',
    orientation : Orientation.Right,
  }

  step4 : TourStep = {
    selector : '#misfavoritos',
    title : 'Mis favoritos',
    content : '<p> Aqui podras ver las granjas que has marcado como favoritas </p>',
    orientation : Orientation.Right,
  }

  step5 : TourStep = {
    selector : '#misasociaciones',
    title : 'Mis asociaciones',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de tus asociaciones </p>',
    orientation : Orientation.Right,
  }

  step6 : TourStep = {
    selector : '#nombre',
    title : 'Nombres y apellidos',
    content : '<p> En este campo puedes ingresar tus nombres y apellidos </p>',
    orientation : Orientation.Bottom,
    scrollAdjustment:1000
  }

  step7 : TourStep = {
    selector : '#celular',
    title : 'Mis asociaciones',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de tus asociaciones </p>',
    orientation : Orientation.Bottom,
  }
  guidedTour : GuidedTour = {
    tourId : 'tour1',
    useOrb  : false,
    steps : [ this.step1,this.step2,this.step3,this.step4,this.step5,this.step6 ],
  }

  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    private _router: Router,
    private guidedTourService : GuidedTourService
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

  starTour(){
    this.guidedTourService.startTour(this.guidedTour)
  }
}