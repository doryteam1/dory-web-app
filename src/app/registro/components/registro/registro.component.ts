import { AfterViewInit, Component,EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegExpUtils } from '../../../utilities/regexps';
import { Utilities } from 'src/app/utilities/utilities';
import { environment } from 'src/environments/environment';

declare var google: any;
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit, AfterViewInit {
  @Output() exit: EventEmitter<any> = new EventEmitter();
  form: FormGroup = new FormGroup({
    cedula: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    tipoUsuario: new FormControl('', [Validators.required]),
    fechaNac: new FormControl(''),
    celular: new FormControl(''),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(RegExpUtils.eigthChar()),
      Validators.pattern(RegExpUtils.capitalcase()),
      Validators.pattern(RegExpUtils.lowercase()),
      Validators.pattern(RegExpUtils.number()),
    ]),
    matchPassword: new FormControl('', Validators.required),
    departamento: new FormControl(''),
    municipio: new FormControl(''),
    corregimiento: new FormControl(''),
    vereda: new FormControl(''),
    terms: new FormControl('', Validators.required),
  });

  tipoUsuarios: any[] = [];
  error: string = '';
  success: boolean = false;

  sucreLatLng = {
    lat: 9.176187,
    lng: -75.110196,
  };
  visiblePass: boolean = false;
  visiblePassDos: boolean = false;
  googleButton: any;
  constructor(
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private userService: UsuarioService
  ) {}

  ngAfterViewInit(): void {
    this.googleButton = this.crearBotonFalsoGoogle();
  }

  ngOnInit(): void {
    this.usuarioService.getTiposUsuario().subscribe((response) => {
      this.tipoUsuarios = response.data;
    });

    //google button setup
    google.accounts.id.initialize({
      client_id: environment.oAuthClientId,
      callback: (response: any) => {
        let payload = Utilities.parseJwt(response.credential);
        console.log(payload);
        this.regUserAuthGoogle(response.credential);
      },
    });
  }

  exiting(event: any) {
    this.exit.emit(true);
  }

  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  iniciarGoogleLogin() {
    this.googleButton.click();
  }
  crearBotonFalsoGoogle() {
    //Crea un nuevo elemento HTML en el documento actual que se está visualizando en el navegador.
    const googleLogin: any = document.createElement('div');
    // Ocultamos el el elmento nuevo
    googleLogin.style.display = 'none';
    // Agregamos el nuevo elemento,se inserta como un elemento secundario del elemento "body" de la página
    document.body.appendChild(googleLogin);
    // Pasamos las propiedades a renderButton, el cual creara un boton de google
    google.accounts.id.renderButton(googleLogin, {
      type: 'icon',
      width: '200',
      prompt: 'select_account',
    });
    //Se adentra dentro de las propidades html del googleLogin y seleciona el div con rol de boton
    const googleLoginRoleButton = googleLogin.querySelector('div[role=button]');
    //Retornamos una funcion llamada clic () esta ejecuta un evento propio de div[role=button]
    return {
      click: () => {
        googleLoginRoleButton.click();
      },
    };
  }
  noMatchingPasswords() {
    return (
      this.password?.value != this.matchPassword?.value &&
      (this.matchPassword?.dirty || this.matchPassword?.touched)
    );
  }

  onSubmit() {
    if (this.form.valid && this.terms?.value) {
      this.spinner.show();
      let newUser = this.form.getRawValue();
      newUser.latitud = this.sucreLatLng.lat;
      newUser.longitud = this.sucreLatLng.lng;

      this.usuarioService.registrarUsuario(newUser).subscribe(
        (response) => {
          this.success = true;
          localStorage.setItem('email', this.email?.value);
          this.success = true;
          this.spinner.hide();
        },
        (err) => {
          this.success = false;
          if (err.error.message == 'El registro ya existe') {
            this.error =
              'El usuario ya se encuentra registrado. Intente iniciar sesión';
          } else {
            this.error = err.error.message;
          }
          this.spinner.hide();
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  onChange() {
    this.error = '';
  }

  loginWithGoogle(): void {
    /*this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.regUserAuthGoogle();
      })
      .catch((err) => {
        console.log(err);
        this.form.markAsUntouched();
        this.error = 'No pudimos ingresar con google';
      });*/
    //console.log("register")
    /*google.accounts.id.prompt((notification: PromptMomentNotification) => {
      console.log('Google prompt event triggered...');

      if (notification.getDismissedReason() === 'credential_returned') {
        console.log('Welcome back!');
      }
    });*/
  }

  regUserAuthGoogle(idToken: string) {
    let payload = Utilities.parseJwt(idToken);
    console.log('regUserAuthGoogle Payload idToken ', payload);
    let email = payload.email;
    localStorage.setItem('email', email);
    this.userService.getUsuarioByEmail(email).subscribe(
      (response) => {
        this.getTokenWithGoogleIdToken(idToken, email);
      },
      (err) => {
        if (err.status == 404) {
          // el usuario no existe
          this.userService
            .registrarUsuario({
              nombres: payload.given_name,
              apellidos: payload.family_name,
              email: payload.email,
              foto: payload.picture,
              latitud: this.sucreLatLng.lat,
              longitud: this.sucreLatLng.lng,
              creadoCon: 'google',
            })
            .subscribe(
              (response) => {
                this.getTokenWithGoogleIdToken(idToken, email);
              },
              (err) => {
                this.form.markAsUntouched();
                this.error = err.error.message;
              }
            );
        }
      }
    );
    /*let email: string;
    let idToken: string;
    this.socialAuthService.authState.subscribe(
      (response) => {
        email = response.email;
        idToken = response.idToken;
        localStorage.setItem('email', email);
        this.usuarioService
          .registrarUsuario({
            nombres: response.firstName,
            apellidos: response.lastName,
            email: response.email,
            foto: response.photoUrl,
            latitud: this.sucreLatLng.lat,
            longitud: this.sucreLatLng.lng,
            creadoCon: 'google',
          })
          .subscribe(
            (response) => {
              this.getTokenWithGoogleIdToken(idToken, email);
            },
            (err) => {
              this.form.markAsUntouched();
              if (err.error.message == 'El registro ya existe') {
                this.error =
                  'El usuario ya se encuentra registrado. Intente iniciar sesión';
              } else {
                this.error = err.error.message;
              }
            }
          );
      },
      (err) => {
        console.log(err);
        this.form.markAsUntouched();
        this.error = 'No pudimos ingresar con google. Intentelo nuevamente.';
      }
    );*/
  }

  getTokenWithGoogleIdToken(idToken: string, email: string) {
    this.userService.loginWithGoogle(idToken).subscribe(
      (response) => {
        this.userService.setLoginData(response.body.token, 'google');
        this.navigateTo(email);
      },
      (err) => {
        console.log(err);
        this.error = 'No se pudo iniciar sesión';
      }
    );
  }

  navigateTo(email: string) {
    this.userService.getUsuarioByEmail(email).subscribe((response) => {
      let usuario = response.data[0];
      if (!usuario.tipo_usuario || !(usuario.nombres && usuario.apellidos)) {
        this.router.navigate(['/welcome', usuario]);
      } else {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  get nombreCompleto() {
    return this.form.get('nombreCompleto');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get matchPassword() {
    return this.form.get('matchPassword');
  }

  get terms() {
    return this.form.get('terms');
  }

  get tipoUsuario() {
    return this.form.get('tipoUsuario');
  }

  eigthChar(cad: string) {
    return RegExpUtils.eigthCharTest(cad);
  }

  capitalcase(cad: string) {
    return RegExpUtils.capitalcaseTest(cad);
  }

  lowercase(cad: string) {
    return RegExpUtils.lowercaseTest(cad);
  }

  number(cad: string) {
    return RegExpUtils.numberTest(cad);
  }

  openScrollableContent() {
    let longContent = ``;

    this.modalService.open(longContent, { scrollable: true });
  }
}
