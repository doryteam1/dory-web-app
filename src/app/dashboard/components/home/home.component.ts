import { Component, OnInit , OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { Orientation, OrientationConfiguration,GuidedTour, TourStep, GuidedTourService } from 'ngx-guided-tour';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  tipoUsuario: string = '';
  error: string = '';
  rutaGranjasdetalle: boolean = false;
  rutaAsociacionesdetalle:boolean=false

  stepMenuPrincipal : TourStep = {
    selector : '#menuOptions',
    title : 'Menú principal',
    content : '<p> Aqui encontrarás todo lo que puedes realizar con tu cuenta. </p>',
    orientation : Orientation.Right,
  }

  stepPerfil : TourStep = {
    selector : '#perfil',
    title : 'Perfil',
    content : '<p> Esta opción te lleva al formulario donde podras llenar toda tu información para que puedan entontrarte. </p>',
    orientation : Orientation.Right,
  }

  stepMisGranjas : TourStep = {
    selector : '#misgranjas',
    title : 'Mis granjas',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de tus granjas piscicolas. </p>',
    orientation : Orientation.Right,
  }

  stepMisProductos : TourStep = {
    selector : '#misproductos',
    title : 'Mis productos',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de los productos que vendes.</p>',
    orientation : Orientation.Right,
  }

  stepAsociaciones : TourStep = {
    selector : '#misasociaciones',
    title : 'Mis asociaciones',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de tus asociaciones. </p>',
    orientation : Orientation.Right,
  }

  stepNombre : TourStep = {
    selector : '#nombre',
    title : 'Nombres y apellidos',
    content : '<p> En este campo puedes ingresar tus nombres y apellidos. </p>',
    orientation : Orientation.Right,
    scrollAdjustment:1000
  }

  stepVehiculos : TourStep = {
    selector : '#misvehiculos',
    title : 'Mis vehiculos',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de tus vehiculos.</p>',
    orientation : Orientation.Right,
  }

  stepConsumo : TourStep = {
    selector : '#consumo',
    title : 'Consumo',
    content : '<p> Aqui puedes ingresar que consumes para que los productores puedan tener una idea de lo que necesitan cultivar.</p>',
    orientation : Orientation.Right,
  }

  stepNegocios : TourStep = {
    selector : '#misnegocios',
    title : 'Mis negocios',
    content : '<p> En esta opción podras registrar, modificar y eliminar la información de tus negocios. </p>',
    orientation : Orientation.Right,
  }
  
  stepFavorito : TourStep = {
    selector : '#misfavoritos',
    title : 'Mis favoritos',
    content : '<p> Aqui podras ver las granjas que has marcado como favoritas. </p>',
    orientation : Orientation.Right
  }
  
  stepDatosBasicos : TourStep = {
    selector : '#basicos',
    title : 'Datos básicos',
    content : '<p> Por favor llena los datos basicos que falten por llenar. </p>',
    orientation : Orientation.Top
  }

  stepFotoPerfil1 : TourStep = {
    selector : '#foto1',
    title : 'Foto de perfil',
    content : '<p> Presiona el icono de la camara para cambiar tu foto de perfil. </p>',
    orientation : Orientation.Bottom
  }

  stepFotoPerfil2 : TourStep = {
    selector : '#foto2',
    title : 'Foto de perfil',
    content : '<p> Tambien puedes cambiarla o eliminarla si ya tienes una presionando este botón. </p>',
    orientation : Orientation.Bottom
  }

  stepUbicacion : TourStep = {
    selector : '#ubicacion',
    title : 'Ubicación',
    content : '<p> En esta sección puedes cambiar los datos que están relacionados con tu ubicación como municipio, dirección entre otros. </p>',
    orientation : Orientation.Top
  }

  stepPhoneNull : TourStep = {
    selector : '#celular',
    title : 'Numero de celular',
    content : '<p> No olvides llenar tu numero de celular. Servira para que te contacen por tus servicios. </p>',
    orientation : Orientation.Bottom
  }

  stepMunicNull : TourStep = {
    selector : '#municipio',
    title : 'Municipio',
    content : '<p> Aún no nos has informado donde vives. </p>',
    orientation : Orientation.Bottom
  }

  stepDirecNull : TourStep = {
    selector : '#direccion',
    title : 'Dirección',
    content : '<p> Cuentanos en donde estas ubicado </p>',
    orientation : Orientation.Bottom
  }

  piscicultorGuidedTour : GuidedTour = {
    tourId : 'tourPiscicultor',
    useOrb  : false,
    steps : [ 
      this.stepMenuPrincipal,
      this.stepPerfil,
      this.stepMisGranjas,
      this.stepFavorito,
      this.stepAsociaciones,
      this.stepDatosBasicos,
      this.stepFotoPerfil1,
      this.stepFotoPerfil2,
      this.stepUbicacion
    ],
    completeCallback:()=>{
      this.onFinishTour()
    },
    skipCallback:()=>{
      this.onFinishTour()
    }
  }

  pescadorGuidedTour : GuidedTour = {
    tourId : 'tourPescador',
    useOrb  : false,
    steps : [ 
      this.stepMenuPrincipal,
      this.stepPerfil,
      this.stepFavorito,
      this.stepAsociaciones,
      this.stepDatosBasicos,
      this.stepFotoPerfil1,
      this.stepFotoPerfil2,
      this.stepUbicacion
    ],
    completeCallback:()=>{
      this.onFinishTour()
    },
    skipCallback:()=>{
      this.onFinishTour()
    }
  }

  proveedorGuidedTour : GuidedTour = {
    tourId : 'tourProveedor',
    useOrb  : false,
    steps : [ 
      this.stepMenuPrincipal,
      this.stepPerfil,
      this.stepMisProductos,
      this.stepFavorito,
      this.stepDatosBasicos,
      this.stepFotoPerfil1,
      this.stepFotoPerfil2,
      this.stepUbicacion,
      this.stepPhoneNull
    ],
    completeCallback:()=>{
      this.onFinishTour()
    },
    skipCallback:()=>{
      this.onFinishTour()
    }
  }

  transportadorGuidedTour : GuidedTour = {
    tourId : 'tourProveedor',
    useOrb  : false,
    steps : [ 
      this.stepMenuPrincipal,
      this.stepPerfil,
      this.stepVehiculos,
      this.stepFavorito,
      this.stepDatosBasicos,
      this.stepFotoPerfil1,
      this.stepFotoPerfil2,
      this.stepUbicacion
    ],
    completeCallback:()=>{
      this.onFinishTour()
    },
    skipCallback:()=>{
      this.onFinishTour()
    }
  }

  consumidorGuidedTour : GuidedTour = {
    tourId : 'tourConsumidor',
    useOrb  : false,
    steps : [ 
      this.stepMenuPrincipal,
      this.stepPerfil,
      this.stepConsumo,
      this.stepFavorito,
      this.stepDatosBasicos,
      this.stepFotoPerfil1,
      this.stepFotoPerfil2,
      this.stepUbicacion
    ],
    completeCallback:()=>{
      this.onFinishTour()
    },
    skipCallback:()=>{
      this.onFinishTour()
    }
  }

  investigadorGuidedTour : GuidedTour = {
    tourId : 'tourInvestigador',
    useOrb  : false,
    steps : [
      this.stepMenuPrincipal,
      this.stepPerfil,
      this.stepFavorito,
      this.stepDatosBasicos,
      this.stepFotoPerfil1,
      this.stepFotoPerfil2,
      this.stepUbicacion
    ],
    completeCallback:()=>{
      this.onFinishTour()
    },
    skipCallback:()=>{
      this.onFinishTour()
    }
  }

  miniGuidedCelularTour : GuidedTour = {
    tourId : 'miniTourCelular',
    useOrb  : false,
    steps : [
      this.stepPhoneNull,
    ],
    skipCallback:()=>{
      setTimeout(()=>{
        console.log("celular tour skiped!", this.authUser)
        if(!(this.authUser.id_municipio)){
          this.guidedTourService.startTour(this.miniGuidedMunicipioTour)
        }else if(!this.authUser.direccion){
          console.log("start tour direccion!", this.miniGuidedDirecTour)
          this.guidedTourService.startTour(this.miniGuidedDirecTour)
        }
      },1000)
    },
    completeCallback:()=>{
      setTimeout(()=>{
        console.log("celular tour complete!", this.authUser)
        if(!(this.authUser.id_municipio)){
          console.log("start tour municipio!")
          this.guidedTourService.startTour(this.miniGuidedMunicipioTour)
        }else if(!this.authUser.direccion){
          console.log("start tour direccion!", this.miniGuidedDirecTour)
          this.guidedTourService.startTour(this.miniGuidedDirecTour)
        }
      },1000)
    }
  }

  miniGuidedMunicipioTour : GuidedTour = {
    tourId : 'miniTourMunic',
    useOrb  : false,
    steps : [
      this.stepMunicNull,
    ],
    skipCallback:()=>{
      setTimeout(()=>{
        if(!(this.authUser.direccion)){
          this.guidedTourService.startTour(this.miniGuidedDirecTour)
        }
      },1000)
    },
    completeCallback:()=>{
      setTimeout(()=>{
        if(!(this.authUser.direccion)){
          this.guidedTourService.startTour(this.miniGuidedDirecTour)
        }
      },1000)
    }
  }

  miniGuidedDirecTour : GuidedTour = {
    tourId : 'miniTourDirec',
    useOrb  : false,
    steps : [
      this.stepDirecNull,
    ]
  }
  authUser: any;
  constructor(
    private socialService: SocialAuthService,
    private userService: UsuarioService,
    private _router: Router,
    private guidedTourService : GuidedTourService,
    private storage:StorageService,
    private us:UsuarioService
  ) {}

  ngAfterViewInit(): void {
    console.log("Home ng on init!")
    if(!this.takedTour() || this.takedTour() !== 'true'){
      console.log("tour init!")
      this.starTour();
    }
  }

  public subscriber!: Subscription;
  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let email = localStorage.getItem('email');
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

        this.us.getUsuarioByEmail(email).subscribe(
          (response) => {
            this.authUser = response.data[0];
            if(this.takedTour()=='true'){
              if(!this.authUser.celular){
                this.guidedTourService.startTour(this.miniGuidedCelularTour)
              }else if(!this.authUser.id_municipio){
                this.guidedTourService.startTour(this.miniGuidedMunicipioTour)
              }else if(!this.authUser.direccion){
                this.guidedTourService.startTour(this.miniGuidedDirecTour)
              }
            } 
        })
  }
  ngOnDestroy() {
    this.subscriber?.unsubscribe();
  }

  starTour(){
    if(this.tipoUsuario){
      if(this.tipoUsuario == 'Piscicultor'){
        this.guidedTourService.startTour(this.piscicultorGuidedTour);
      }else if(this.tipoUsuario == 'Pescador'){
        this.guidedTourService.startTour(this.pescadorGuidedTour);
      }else if(this.tipoUsuario == 'Proveedor'){
        this.guidedTourService.startTour(this.proveedorGuidedTour);
      }else if(this.tipoUsuario == 'Transportador'){
        this.guidedTourService.startTour(this.transportadorGuidedTour);
      }else if(this.tipoUsuario == 'Investigador Experto'){
        this.guidedTourService.startTour(this.investigadorGuidedTour);
      }else if(this.tipoUsuario == 'Consumidor'){
        this.guidedTourService.startTour(this.consumidorGuidedTour);
      }
    }
    
  }

  onFinishTour(){
    this.storage.add('takeTour',true);
    setTimeout(()=>{
      if(!this.authUser.celular){
        this.guidedTourService.startTour(this.miniGuidedCelularTour);
      }else if(!this.authUser.id_municipio){
        this.guidedTourService.startTour(this.miniGuidedMunicipioTour);
      }else if(!this.authUser.direccion){
        this.guidedTourService.startTour(this.miniGuidedDirecTour);
      }
    },1000)
  }

  takedTour(){
    return this.storage.get('takeTour')
  }
}