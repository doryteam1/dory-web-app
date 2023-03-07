import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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

  constructor(
    private router: Router,
    private userService: UsuarioService,
    private socialAuthService: SocialAuthService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    let remEmail = localStorage.getItem('rememberEmail');
    if (remEmail) {
      this.form.get('email')?.setValue(remEmail);
      this.recordarme = true;
    }
  }

  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
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

  loginWithGoogle(): void {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.regUserAuthGoogle();
      })
      .catch((err) => {
        console.log(err);
        this.form.markAsUntouched();
        this.error = 'No pudimos ingresar con google';
      });
  }

  regUserAuthGoogle() {
    let email: string;
    let idToken: string;
    this.socialAuthService.authState.subscribe(
      (response) => {
        idToken = response.idToken;
        email = response.email;
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
                    this.error = err.error.message;
                  }
                );
            }
          }
        );
      },
      (err) => {
        console.log(err);
        this.form.markAsUntouched();
        this.error = 'No pudimos ingresar con google';
      }
    );
  }

  getTokenWithGoogleIdToken(idToken: string, email: string) {
    this.userService.loginWithGoogle(idToken).subscribe(
      (response) => {
        this.userService.setLoginData(response.body.token, 'google');
        this.chatService.reset();
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

  recordarmeOnChange() {
    this.recordarme = !this.recordarme;
    console.log(this.recordarme);
  }
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
