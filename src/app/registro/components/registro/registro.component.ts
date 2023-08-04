import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegExpUtils } from '../../../utilities/regexps';
import { Utilities } from 'src/app/utilities/utilities';
import { environment } from 'src/environments/environment';
import { WhiteSpaceValidator } from 'src/app/validators/white-space.validator';
import { PlacesService } from 'src/app/services/places.service';


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
    nombres: new FormControl('', [Validators.required, WhiteSpaceValidator]),
    apellidos: new FormControl('', [Validators.required, WhiteSpaceValidator]),
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
    id_departamento: new FormControl(''),
    id_municipio: new FormControl('', Validators.required),
    latitud: new FormControl(''),
    longitud: new FormControl(''),
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
  municipios: any[] = [];
  departamentos: any[] = [];
  tipoUserId: number = 0;
  muniSucre: any[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private userService: UsuarioService,
    private places: PlacesService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.googleButton = this.crearBotonFalsoGoogle();

  }

  ngOnInit(): void {
    this.usuarioService.getTiposUsuario().subscribe((response) => {
      this.tipoUsuarios = response.data;
    });

    this.changeDpto(70);
    this.loadDptos();

    this.id_municipio?.valueChanges.subscribe((value) => {
      if (this.tipoUsuario?.value != 2) {
        this.places.getMunicipioById(value).subscribe(
          (response) => {
            if (response.data != 0) {
              this.latitud?.setValue(Number(response.data[0].latitud));
              this.longitud?.setValue(Number(response.data[0].longitud));
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.latitud?.setValue(0);
        this.longitud?.setValue(0);
      }
    });

    //google button setup
    google.accounts.id.initialize({
      client_id: environment.oAuthClientId,
      callback: (response: any) => {
        let payload = Utilities.parseJwt(response.credential);
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
    const googleLogin: HTMLElement = document.createElement('div');
    // Ocultamos el el elmento nuevo
    googleLogin.style.display = 'none';
    // Agregamos el nuevo elemento,se inserta como un elemento secundario del elemento "body" de la página
    document.body.appendChild(googleLogin);
    // Pasamos las propiedades a renderButton, el cual creara un boton de google
    google?.accounts?.id?.renderButton(googleLogin, {
      type: 'icon',
      prompt: 'select_account',
    });
    //Se adentra dentro de las propidades html del googleLogin y seleciona el div con rol de boton
    const googleLoginRoleButton:any  = googleLogin.querySelector('div[role=button]');
    //Retornamos una funcion llamada clic () esta ejecuta un evento propio de div[role=button]
    return {
      click: () => {
        googleLoginRoleButton?.click();
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
      this.usuarioService.registrarUsuario(newUser).subscribe(
        (response) => {
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

  regUserAuthGoogle(idToken: string) {
    let payload = Utilities.parseJwt(idToken);
    localStorage.setItem('idTokenGoogle', idToken);
    let email = payload.email;
    localStorage.setItem('email', email);
    this.userService.getUsuarioByEmail(email).subscribe(
      (response) => {
        if (response.data[0].id_tipo_usuario == null) {
          localStorage.setItem('dataUserComplete', 'false');
          localStorage.setItem('idUsuario', response.data[0].id);
          localStorage.setItem('nombres', response.data[0].nombres);
          localStorage.setItem('apellidos', response.data[0].apellidos);
          this.ngZone.run(() => {
            this.router.navigate(['/welcome']);
          });
        } else {
          localStorage.setItem('dataUserComplete', 'true');
          this.getTokenWithGoogleIdToken(idToken, email);
        }
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
                localStorage.setItem('nombres', payload.given_name);
                localStorage.setItem('apellidos', payload.family_name);
                localStorage.setItem('idUsuario', response.body.insertId);
                localStorage.setItem('dataUserComplete', 'false');
                this.ngZone.run(() => {
                  this.router.navigate(['/welcome']);
                });
              },
              (err) => {
                this.form.markAsUntouched();
                this.error = err.error.message;
              }
            );
        }
      }
    );
  }

  getTokenWithGoogleIdToken(idToken: string, email: string) {
    this.userService.loginWithGoogle(idToken).subscribe(
      (response) => {
        this.userService.setLoginData(response.body.token, 'google', idToken);
        this.navigateTo(email);
      },
      (err) => {
        console.log(err);
        this.error = 'No se pudo iniciar sesión';
      }
    );
  }

  navigateTo(email: string) {
    this.ngZone.run(() => {
      this.userService.getUsuarioByEmail(email).subscribe((response) => {
        let usuario = response.data[0];
        if (!usuario.tipo_usuario || !(usuario.nombres && usuario.apellidos)) {
          this.router.navigate(['/welcome']);
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      });
    });
  }

  changeRol() {
    this.municipios = [];
    if (this.tipoUsuario?.value == 2) {
      this.id_municipio?.setValue('');
      this.id_departamento?.setValue('');
    } else {
      if (this.id_municipio?.value != '' && this.id_departamento?.value != '') {
        this.id_municipio?.setValue('');
        this.id_departamento?.setValue('');
      } else if (
        this.id_municipio?.value == '' &&
        this.id_departamento?.value != ''
      ) {
        this.id_departamento?.setValue('');
      }
      this.municipios = [...this.muniSucre];
    }
  }

  loadDptos() {
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.departamentos = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadMuni() {
    if (this.tipoUsuario?.value == 2) {
      this.id_municipio?.setValue('');
      this.municipios = [];
      this.changeDpto(this.id_departamento?.value);
    }
  }

  changeDpto(idDepart: number) {
    this.places.getMunicipiosDepartamentos(idDepart).subscribe(
      (response) => {
        this.municipios = response.data;
        if (idDepart == 70) {
          this.muniSucre = [...this.municipios];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  get apellidos() {
    return this.form.get('apellidos');
  }
  get nombres() {
    return this.form.get('nombres');
  }

  get id_departamento() {
    return this.form.get('id_departamento');
  }
  get id_municipio() {
    return this.form.get('id_municipio');
  }

  get latitud() {
    return this.form.get('latitud');
  }
  get longitud() {
    return this.form.get('longitud');
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
