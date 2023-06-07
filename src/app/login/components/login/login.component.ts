import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from 'src/environments/environment';
import { Utilities } from 'src/app/utilities/utilities';


declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  loading: boolean = false;
  recordarme: boolean = false;
  error: string = '';
  visiblePass: boolean = false;

  sucreLatLng = {
    lat: 9.176187,
    lng: -75.110196,
  };

  googleButton: any;
  constructor(
    private router: Router,
    private userService: UsuarioService,
    private chatService: ChatService,
    private ngZone: NgZone
  ) {}
  ngAfterViewInit(): void {
    this.googleButton = this.crearBotonFalsoGoogle();
  }

  ngOnInit(): void {
    let remEmail = localStorage.getItem('rememberEmail');
    if (remEmail) {
      this.form.get('email')?.setValue(remEmail);
      this.recordarme = true;
    }

    //google button setup
    google.accounts.id.initialize({
      client_id: environment.oAuthClientId,
      callback: (response: any) => {
        //  let payload = Utilities.parseJwt(response.credential);
        this.regUserAuthGoogle(response.credential);
      },
    });
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
  //Registro con google
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
        this.chatService.reset();
        this.navigateTo(email);
      },
      (err) => {
        console.log(err);
        this.error = 'No se pudo iniciar sesión';
      }
    );
  }

  onChange() {
    console.log('on change');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    let data: any = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };

    this.userService.login(data).subscribe(
      (response) => {
        localStorage.setItem('email', data.email);
        this.userService.setLoginData(response.body.token, 'email');
        if (this.recordarme == true) {
          localStorage.setItem('rememberEmail', data.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
        this.loading = false;
        this.chatService.reset();
        this.navigateTo(data.email);
      },
      (err) => {
        if (err.status == 400 || err.status == 404) {
          this.error = err.error.message;
        } else {
          this.error = 'Error inesperado';
        }
        this.loading = false;
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
          localStorage.setItem('dataUserComplete', 'true');
          localStorage.removeItem('idTokenGoogle');
          this.router.navigateByUrl('/dashboard');
        }
      });
    });
  }

  recordarmeOnChange() {
    this.recordarme = !this.recordarme;
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
