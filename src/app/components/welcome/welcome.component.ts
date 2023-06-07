import { Component, NgZone, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
import { PlatformLocation } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  form: FormGroup = new FormGroup({
    id_tipo_usuario: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(''),
    id_municipio: new FormControl('', Validators.required),
    latitud: new FormControl(''),
    longitud: new FormControl(''),
  });

  tipos: Array<any> = [];
  nombres: string | null = '';
  apellidos: string | null = '';
  error: string = '';
  id: string | null = '';
  municipios: any[] = [];
  departamentos: any[] = [];
  muniSucre: any[] = [];

  constructor(
    private us: UsuarioService,
    private router: Router,
    private places: PlacesService,
    public location: PlatformLocation,
    private chatService: ChatService,
    private spinner: NgxSpinnerService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    localStorage.setItem('urlPrevious', this.router.routerState.snapshot.url);
    let email: any = localStorage.getItem('email');
    this.nombres = localStorage.getItem('nombres');
    this.apellidos = localStorage.getItem('apellidos');
    this.id = localStorage.getItem('idUsuario');
    if (
      !localStorage.getItem('nombres') ||
      !localStorage.getItem('apellidos') ||
      !localStorage.getItem('idUsuario')
    ) {
      this.us.getUsuarioByEmail(email).subscribe((response) => {
        let { nombres, apellidos, id } = response.data[0];
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.id = id;
        localStorage.setItem('idUsuario', id);
        localStorage.setItem('nombres', nombres);
        localStorage.setItem('apellidos', apellidos);
      });
    }
    this.changeDpto(70);
    this.loadDptos();
    this.us.getTiposUsuario().subscribe(
      (response) => {
        this.tipos = response.data;
      },
      (err) => {
        this.error = 'Error al cargar los tipos de usuarios';
      }
    );

    this.id_municipio?.valueChanges.subscribe((value) => {
      if (this.id_tipo_usuario?.value != 2) {
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
  }

  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
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

  changeRol() {
    this.municipios = [];
    if (this.id_tipo_usuario?.value == 2) {
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
    if (this.id_tipo_usuario?.value == 2) {
      this.id_municipio?.setValue('');
      this.municipios = [];
      this.changeDpto(this.id_departamento?.value);
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      let idToken: string = localStorage.getItem('idTokenGoogle')!;

      if (this.id_tipo_usuario?.value !== 2) {
        this.id_departamento?.setValue(70);
      }
      let usuario = this.form.getRawValue();

      try {
        const response = await this.us.loginWithGoogle(idToken).toPromise();
        localStorage.setItem('token', response.body.token);
        await this.us.actualizarUsuario(parseInt(this.id as string), usuario).toPromise();
        localStorage.setItem('dataUserComplete', 'true');
        const loginResponse = await this.us.loginWithGoogle(idToken).toPromise();
        this.spinner.hide();
        this.us.setLoginData(loginResponse.body.token, 'google', idToken);
        this.us.removeLocalStorage(false);
        this.ngZone.run(() => {
          this.router.navigateByUrl('/dashboard');
        });
        this.chatService.reset();
      } catch (err) {
        console.log(err);
        this.spinner.hide();
        this.error = 'No se pudo iniciar sesión';
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  btnSalir() {
    this.ngZone.run(() => {
      this.router.navigateByUrl('/home');
      this.us.removeLocalStorage(true);
    });
  }

  get id_tipo_usuario() {
    return this.form.get('id_tipo_usuario');
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
}
