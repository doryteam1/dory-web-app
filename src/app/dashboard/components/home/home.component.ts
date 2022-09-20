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
    title: 'Mis vehiculos',
    element: '#misvehiculos',
    intro:
      'En esta opción podrás registrar, modificar y eliminar la información de tus vehículos.',
  };
  stepConsumo: IntroToursteps = {
    title: 'Consumo',
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
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepUbicacion,
  ];
  pescadorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepFavorito,
    this.stepAsociaciones,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepUbicacion,
  ];
  proveedorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepMisProductos,
    this.stepFavorito,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepUbicacion,
    this.stepPhoneNull,
  ];
  transportadorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepVehiculos,
    this.stepFavorito,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepUbicacion,
  ];
  consumidorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepConsumo,
    this.stepFavorito,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepUbicacion,
  ];
  investigadorGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepFavorito,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepUbicacion,
  ];
  comercianteGuidedTour: IntroGuidedTour[] = [
    this.stepWelcome,
    this.stepMenuPrincipal,
    this.stepPerfil,
    this.stepFavorito,
    this.stepNegocios,
    this.stepDatosBasicos,
    this.stepFotoPerfil1,
    this.stepFotoPerfil2,
    this.stepUbicacion,
  ];
  miniGuidedCelularTour: IntroGuidedTour[] = [this.stepPhoneNull];
  miniGuidedDirecTour: IntroGuidedTour[] = [this.stepDirecNull];
  miniGuidedMunicipioTour: IntroGuidedTour[] = [this.stepMunicNull];
  // miniGuidedCelularTour: GuidedTour = {
  //   tourId: 'miniTourCelular',
  //   useOrb: false,
  //   steps: [this.stepPhoneNull],
  //   skipCallback: () => {
  //     /* setTimeout(()=>{
  //       console.log("celular tour skiped!", this.authUser)
  //       if(!(this.authUser.id_municipio)){
  //         this.guidedTourService.startTour(this.miniGuidedMunicipioTour)
  //       }else if(!this.authUser.direccion){
  //         console.log("start tour direccion!", this.miniGuidedDirecTour)
  //         this.guidedTourService.startTour(this.miniGuidedDirecTour)
  //       }
  //     },1000) */
  //   },
  //   completeCallback: () => {
  //     /*  setTimeout(()=>{
  //       console.log("celular tour complete!", this.authUser)
  //       if(!(this.authUser.id_municipio)){
  //         console.log("start tour municipio!")
  //         this.guidedTourService.startTour(this.miniGuidedMunicipioTour)
  //       }else if(!this.authUser.direccion){
  //         console.log("start tour direccion!", this.miniGuidedDirecTour)
  //         this.guidedTourService.startTour(this.miniGuidedDirecTour)
  //       }
  //     },1000) */
  //   },
  // };

  // miniGuidedMunicipioTour: GuidedTour = {
  //   tourId: 'miniTourMunic',
  //   useOrb: false,
  //   steps: [this.stepMunicNull],
  //   skipCallback: () => {
  //     /*  setTimeout(()=>{
  //       if(!(this.authUser.direccion)){
  //         this.guidedTourService.startTour(this.miniGuidedDirecTour)
  //       }
  //     },1000) */
  //   },
  //   completeCallback: () => {
  //     /*   setTimeout(()=>{
  //       if(!(this.authUser.direccion)){
  //         this.guidedTourService.startTour(this.miniGuidedDirecTour)
  //       }
  //     },1000) */
  //   },
  // };
  authUser: any;
  tipoUsuario: string = '';
  error: string = '';
  offcanvas: any;
  rutaGranjasdetalle: boolean = false;
  rutaAsociacionesdetalle: boolean = false;
  rutaProductosdetalle: boolean = false;
  rutaVehiculosdetalle: boolean = false;
  rutaNegociosdetalle: boolean = false;
  sidebar: boolean = false;
  closeOffCamba: boolean = false;
  disableTags: boolean = false;
  rutaUrlactiva: any;
  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    private _router: Router,
    private storage: StorageService,
    private us: UsuarioService,
    public mediaQueryService: MediaQueryService,
    private introService: IntrojsService
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
       /*    setTimeout(() => {
          }, 500); */
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
      } /* else if (
        this.authUser.celular &&
        this.authUser.id_municipio &&
        this.authUser.direccion
      ) {
        this.disableTags = false;
      } */
    });
  }
  ngOnInit(): void {
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
    let urlactiva = this._router.url;
    if (urlactiva.includes('/dashboard/granja/detalle')) {
      this.rutaGranjasdetalle = true;
    } else if (urlactiva.includes('/dashboard/asociacion/detalle')) {
      this.rutaAsociacionesdetalle = true;
    } else if (urlactiva.includes('/dashboard/producto/detalle')) {
      this.rutaProductosdetalle = true;
    } else if (urlactiva.includes('/dashboard/vehiculo/detalle')) {
      this.rutaVehiculosdetalle = true;
    } else if (urlactiva.includes('/dashboard/negocio/detalle')) {
      this.rutaNegociosdetalle = true;
    }
    this.subscriber = this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.rutaGranjasdetalle = false;
        this.rutaAsociacionesdetalle = false;
        this.rutaProductosdetalle = false;
        this.rutaVehiculosdetalle = false;
        this.rutaNegociosdetalle = false;
        let urlactiva = event.url;
        if (urlactiva.includes('/dashboard/granja/detalle')) {
          this.rutaGranjasdetalle = true;
          this.rutaAsociacionesdetalle = false;
          this.rutaProductosdetalle = false;
          this.rutaVehiculosdetalle = false;
          this.rutaNegociosdetalle = false;
        } else if (urlactiva.includes('/dashboard/asociacion/detalle')) {
          this.rutaAsociacionesdetalle = true;
          this.rutaGranjasdetalle = false;
          this.rutaProductosdetalle = false;
          this.rutaVehiculosdetalle = false;
          this.rutaNegociosdetalle = false;
        } else if (urlactiva.includes('/dashboard/producto/detalle')) {
          this.rutaProductosdetalle = true;
          this.rutaVehiculosdetalle = false;
          this.rutaAsociacionesdetalle = false;
          this.rutaGranjasdetalle = false;
          this.rutaNegociosdetalle = false;
        } else if (urlactiva.includes('/dashboard/vehiculo/detalle')) {
          this.rutaVehiculosdetalle = true;
          this.rutaProductosdetalle = false;
          this.rutaAsociacionesdetalle = false;
          this.rutaGranjasdetalle = false;
          this.rutaNegociosdetalle = false;
        } else if (urlactiva.includes('/dashboard/negocio/detalle')) {
          this.rutaVehiculosdetalle = false;
          this.rutaProductosdetalle = false;
          this.rutaAsociacionesdetalle = false;
          this.rutaGranjasdetalle = false;
          this.rutaNegociosdetalle = true;
        } else {
          this.rutaAsociacionesdetalle = false;
          this.rutaGranjasdetalle = false;
          this.rutaProductosdetalle = false;
          this.rutaVehiculosdetalle = false;
          this.rutaNegociosdetalle = false;
        }
      });
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
    this.offcanvas.hide();
    this.closeOffCamba = true;
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
      }/*  else if (
        this.authUser.celular &&
        this.authUser.id_municipio &&
        this.authUser.direccion
      ) {
        this.disableTags = false;
      } */
    }, 1000);
  }
  takedTour() {
    return this.storage.get('takeTour');
  }
}
