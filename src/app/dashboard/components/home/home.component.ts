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
import { filter } from 'rxjs/internal/operators/filter';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { IntrojsService } from 'src/app/services/introjs.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';
import { IntroGuidedTour, IntroToursteps } from 'src/models/introJsTourt.model';
declare var window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dropdownNotificacion')
  dropdownNotificacion!: ElementRef<HTMLElement>;
  stepWelcome: IntroToursteps = {
    title: 'Bienvenido',
    intro:
      'A continuación iniciarás un breve recorrido, al finalizar recuerda llenar todos los datos obligatorios.',
  };
  stepMenuPrincipal: IntroToursteps = {
    title: 'Menú principal',
    element: '#menuOptions',
    intro: 'Aquí encontrarás todo lo que puedes realizar con tu cuenta',
  };
  stepPerfil: IntroToursteps = {
    title: 'Perfil',
    element: '#perfil',
    intro:
      'Esta opción te lleva al formulario donde podrás llenar toda tú información, para que así puedan encontrarte.',
  };
  stepContrasena: IntroToursteps = {
    title: 'Cambiar contraseña',
    element: '#contrasena',
    intro: 'Desde aquí podrás cambiar la contraseña de la cuenta',
  };
  stepMispublicaciones: IntroToursteps = {
    title: 'Mis publicaciones',
    element: '#mispublicaciones',
    intro: 'Desde aquí podrás publicar todo',
  };
  stepPublicaciones: IntroToursteps = {
    title: 'Publicaciones',
    element: '#publicaciones_user',
    intro: 'Desde aquí podrás ver todas las publicaciones, hechas por un pescador o piscicultor',
  };
  stepOtrosDocumentos: IntroToursteps = {
    title: 'Documentos adicionales',
    element: '#otrosDocumentos',
    intro: 'Desde aquí podrás cargar tú documento de cedula y sisben',
  };
  stepMisGranjas: IntroToursteps = {
    title: 'Mis granjas',
    element: '#misgranjas',
    intro:
      ' En esta opción podrás registrar, modificar y eliminar la información de tus granjas piscicolas.',
  };
  stepMisProductos: IntroToursteps = {
    title: 'Mis productos',
    element: '#misproductos',
    intro:
      'En esta opción podrás registrar, modificar y eliminar la información de los productos que vendes.',
  };

  stepAsociaciones: IntroToursteps = {
    title: 'Mis asociaciones',
    element: '#misasociaciones',
    intro:
      'En esta opción podrás registrar, modificar y eliminar la información de tus asociaciones.',
  };
  stepNombre: IntroToursteps = {
    title: 'Nombres y apellidos',
    element: '#nombre',
    intro: 'En este campo puedes ingresar tus nombres y apellidos.',
  };
  stepVehiculos: IntroToursteps = {
    title: 'Mis vehículos',
    element: '#misvehiculos',
    intro:
      'En esta opción podrás registrar, modificar y eliminar la información de tus vehículos.',
  };
  stepConsumo: IntroToursteps = {
    title: 'Mis consumos',
    element: '#consumo',
    intro:
      'Aquí podrás ingresar lo que consumes, así los productores podran tener una idea de lo que necesitan cultivar.',
  };
  stepNegocios: IntroToursteps = {
    title: 'Mis negocios',
    element: '#misnegocios',
    intro:
      'En esta opción podrás registrar, modificar y eliminar la información de tus negocios.',
  };
  stepSalir: IntroToursteps = {
    title: 'Salir',
    element: '#salir',
    intro: 'Desde aquí podras cerrar la sesión.',
  };
  stepFavorito: IntroToursteps = {
    title: 'Mis favoritos',
    element: '#misfavoritos',
    intro: 'Aquí podrás ver las granjas que has marcado como favoritas.',
  };
  stepDatosBasicos: IntroToursteps = {
    title: 'Datos básicos',
    element: '#basicos',
    intro:
      'Aquí encontrarás todos tus datos básicos, recuerda llenar los obligatorios.',
  };
  stepFotoPerfil1: IntroToursteps = {
    title: 'Foto de perfil',
    element: '#foto1',
    intro:
      'Presionando el icono de la cámara, podrás cambiar tu foto de perfil.',
  };
  stepFotoPerfil2: IntroToursteps = {
    title: 'Foto de perfil',
    element: '#foto2',
    intro: 'Desde aquí, también podrás cambiar o eliminar tu foto de perfil.',
  };
  stepUbicacion: IntroToursteps = {
    title: 'Ubicación',
    element: '#ubicacion',
    intro:
      'En esta sección podrás ingresar la información referente a tu ubicación.',
  };
  stepPhoneNull: IntroToursteps = {
    title: 'Numero de celular',
    element: '#celular',
    intro:
      'No olvides llenar tu número de celular. Servirá para contactarte facilmente',
  };
  stepMunicNull: IntroToursteps = {
    title: 'Municipio',
    element: '#municipio',
    intro: 'Escoge el municipio donde vives ',
  };
  stepDirecNull: IntroToursteps = {
    title: 'Dirección',
    element: '#direccion',
    intro: 'Ingresa tu dirección ',
  };
  piscicultorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepMisGranjas,
    this.stepFavorito,
    this.stepAsociaciones,
    this.stepMispublicaciones,
    this.stepContrasena,
    this.stepSalir,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepOtrosDocumentos,
    this.stepUbicacion,
  ];
  pescadorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepFavorito,
    this.stepAsociaciones,
    this.stepMispublicaciones,
    this.stepContrasena,
    this.stepSalir,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepOtrosDocumentos,
    this.stepUbicacion,
  ];
  proveedorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepMisProductos,
    this.stepFavorito,
    this.stepContrasena,
    this.stepSalir,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepOtrosDocumentos,
    this.stepUbicacion,
  ];
  transportadorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepVehiculos,
    this.stepFavorito,
    this.stepContrasena,
    this.stepSalir,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepOtrosDocumentos,
    this.stepUbicacion,
  ];
  consumidorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepConsumo,
    this.stepFavorito,
    this.stepContrasena,
    this.stepSalir,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepOtrosDocumentos,
    this.stepUbicacion,
  ];
  investigadorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepFavorito,
    this.stepContrasena,
    this.stepSalir,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepOtrosDocumentos,
    this.stepUbicacion,
  ];
  comercianteGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepFavorito,
    this.stepNegocios,
    this.stepPublicaciones,
    this.stepContrasena,
    this.stepSalir,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepOtrosDocumentos,
    this.stepUbicacion,
  ];
  miniGuidedCelularTour: IntroGuidedTour[] = [this.stepPhoneNull];
  miniGuidedDirecTour: IntroGuidedTour[] = [this.stepDirecNull];
  miniGuidedMunicipioTour: IntroGuidedTour[] = [this.stepMunicNull];
  authUser: any;
  tipoUsuario: string = '';
  error: string = '';
  offcanvas: any;
  sidebar: boolean = false;
  closeOffCamba: boolean = false;
  disableTags: boolean = false;
  electronActivo: boolean=false;
  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    public _router: Router,
    private storage: StorageService,
    private us: UsuarioService,
    public mediaQueryService: MediaQueryService,
    private introService: IntrojsService,
    private _electronService: ElectronjsService,
  ) {}
  subscriber!: Subscription;
  MediaQuery!: Subscription;
  elementoActivoTour!: Subscription;
  onCompleteTourt!: Subscription;
  ngAfterViewInit(): void {
    let email = localStorage.getItem('email');
    this.us.getUsuarioByEmail(email).subscribe((response) => {
      this.authUser = response.data[0];
      if (!this.authUser.takeTour) {
        if (this.sidebar) {
          this.openOffcanvas();
          this.starTour();
        } else {
          this.starTour();
        }
      } else if (!this.authUser.celular) {
        /* this.disableTags = true; */
        this.introService.miniTour(this.miniGuidedCelularTour);
      } else if (!this.authUser.id_municipio) {
        /* this.disableTags = true; */
        this.introService.miniTour(this.miniGuidedMunicipioTour);
      } else if (!this.authUser.direccion) {
        /* this.disableTags = true; */
        this.introService.miniTour(this.miniGuidedDirecTour);
      }
    });
  }
  ngOnInit(): void {
    this.electronActivo= this._electronService.ipcActivo;
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
    if (this.tipoUsuario) {
      if (this.tipoUsuario == 'Piscicultor') {
        this.introService.tourPrincipal(this.piscicultorGuidedTour);
      } else if (this.tipoUsuario == 'Pescador') {
        this.introService.tourPrincipal(this.pescadorGuidedTour);
      } else if (this.tipoUsuario == 'Proveedor') {
        this.introService.tourPrincipal(this.proveedorGuidedTour);
      } else if (this.tipoUsuario == 'Transportador') {
        this.introService.tourPrincipal(this.transportadorGuidedTour);
      } else if (this.tipoUsuario == 'Investigador Experto') {
        this.introService.tourPrincipal(this.investigadorGuidedTour);
      } else if (this.tipoUsuario == 'Consumidor') {
        this.introService.tourPrincipal(this.consumidorGuidedTour);
      } else if (this.tipoUsuario == 'Comerciante') {
        this.introService.tourPrincipal(this.comercianteGuidedTour);
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
    setTimeout(() => {
      if (!this.authUser.celular) {
        /* this.disableTags = true; */
        this.introService.miniTour(this.miniGuidedCelularTour);
      } else if (!this.authUser.id_municipio) {
        /* this.disableTags = true; */
        this.introService.miniTour(this.miniGuidedMunicipioTour);
      } else if (!this.authUser.direccion) {
        /*  this.disableTags = true; */
        this.introService.miniTour(this.miniGuidedDirecTour);
      }
    }, 1000);
  }
  takedTour() {
    return this.storage.get('takeTour');
  }
  logout() {
    if (this.electronActivo) {
      this.userService.logoutElectron()
    }else{
      this.userService.logout();
    }
    this._router.navigateByUrl('/home');
  }
}
