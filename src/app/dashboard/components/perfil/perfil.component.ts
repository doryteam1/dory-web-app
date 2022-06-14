import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,

} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AreasExperticiaService } from 'src/app/services/areas-experticia.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TopAlertControllerService } from 'src/app/shared/services/top-alert-controller.service';
import { Utilities } from 'src/app/utilities/utilities';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { vertices } from '../../../global/constants';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
@ViewChild('map') map: any;
  usuario: any;
   @ViewChild('fileInput') inputFileDialog!: ElementRef;
  fileName: string = '';
  file: any;
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loading: boolean = false;
   loadingseart:boolean=false
  noexistendatos:boolean=false
  borrarseart:boolean=false
  valorbuscarx: string = '';
  areas: Array<any> = [];
  departamentos: Array<any> = [];
  municipios: Array<any> = [];
  corregimientos: Array<any> = [];
  veredas: Array<any> = [];
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    cedula: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    celular: new FormControl(''),
    direccion: new FormControl(''),
    id_tipo_usuario: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    id_area_experticia: new FormControl(0),
    nombre_negocio: new FormControl(''),
    foto: new FormControl(''),
    fecha_registro: new FormControl(''),
    fecha_nacimiento: new FormControl(''),
    nombre_vereda: new FormControl(''),
    id_departamento: new FormControl(0),
    id_municipio: new FormControl(0),
    id_corregimiento: new FormControl(0),
    id_vereda: new FormControl(''),
    latitud: new FormControl(''),
    longitud: new FormControl(''),
    nombre_corregimiento: new FormControl(''),
    otra_area_experticia: new FormControl(''),
    otra_area_experticia_descripcion: new FormControl(''),
    sobre_mi: new FormControl(''),
  });

  campos: any = {
    proveedor: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'coordenadas',
    ],
    investigadorexperto: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'area_experticia',
      'otra_area_experticia',
      'otra_area_experticia_descripcion',
      'sobre_mi',
      'email',
    ],
    transportador: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'coordenadas',
    ],
    piscicultor: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'coordenadas',
    ],
    consumidor: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
    ],
    comerciante: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'nombre_negocio',
      'email',
      'coordenadas',
    ],
    asociacion: [],
    pescador: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'vereda',
      'direccion',
      'coordenadas',
      'email',
    ],
  };

  /* center: google.maps.LatLngLiteral = { lat: 9.59079, lng: -75.546899 }; */
  /* zoom = 10; */
  options: google.maps.MapOptions = {
    scrollwheel: true,
    center: { lat: 9.59079, lng: -75.546899 },
    zoom: 10,
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 9.214145,
    lng: -75.188469,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };
  vertices = vertices;
  apiLoaded: Observable<boolean>;
  percentUploaded: number | undefined = 0;
  constructor(
    private us: UsuarioService,
    private aes: AreasExperticiaService,
    private router: Router,
    private places: PlacesService,
    private storageService: StorageService,
    httpClient: HttpClient,
    private storage: FirebaseStorageService,
    private topAlertController: TopAlertControllerService,
    private geocoder: MapGeocoder,
    private confirmModalMapService: ConfirmModalMapService,
    private modalService: NgbModal,
  ) {
    this.apiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=' + environment.doryApiKey,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    registerLocaleData( es );
    this.latitud?.disable();
    this.longitud?.disable();
    this.email?.disable();
    let email: string | null = localStorage.getItem('email');
    this.us.getUsuarioByEmail(email).subscribe(
      (response) => {
        this.usuario = response.data[0];
        this.form.get('id')?.setValue(this.usuario.id);
        this.form.get('cedula')?.setValue(this.usuario.cedula);
        this.form.get('nombres')?.setValue(this.usuario.nombres);
        this.form.get('apellidos')?.setValue(this.usuario.apellidos);
        this.form.get('celular')?.setValue(this.usuario.celular);
        this.form.get('direccion')?.setValue(this.usuario.direccion);
        this.form
          .get('id_tipo_usuario')
          ?.setValue(this.usuario.id_tipo_usuario);
        this.form.get('email')?.setValue(this.usuario.email);
        this.form
          .get('id_area_experticia')
          ?.setValue(this.usuario.id_area_experticia);
        this.form.get('nombre_negocio')?.setValue(this.usuario.nombre_negocio);
        this.form.get('foto')?.setValue(this.usuario.foto);
        this.form
          .get('fecha_registro')
          ?.setValue(Utilities.dateToISOString(this.usuario.fecha_registro));
        this.form
          .get('fecha_nacimiento')
          ?.setValue(Utilities.dateToISOString(this.usuario.fecha_nacimiento));
        this.form.get('nombre_vereda')?.setValue(this.usuario.nombre_vereda);
        this.form.get('id_municipio')?.setValue(this.usuario.id_municipio);
        this.form
          .get('id_corregimiento')
          ?.setValue(this.usuario.id_corregimiento);
        this.form.get('id_vereda')?.setValue(this.usuario.id_vereda);
        this.form.get('latitud')?.setValue(this.usuario.latitud);
        this.form.get('longitud')?.setValue(this.usuario.longitud);
        this.form
          .get('nombre_corregimiento')
          ?.setValue(this.usuario.nombre_corregimiento);
        this.otraAreaExp?.setValue(this.usuario.otra_area_experticia);
        this.otraAreaExpDesc?.setValue(
          this.usuario.otra_area_experticia_descripcion
        );

        if (this.usuario.id_departamento == 0) {
          this.form.get('id_departamento')?.setValue(70);
        } else {
          this.form
            .get('id_departamento')
            ?.setValue(this.usuario.id_departamento);
        }

        this.idDpto?.disable();
        this.idMunic?.disable();
        this.loadAreasExp();
        this.loadDptos();
        this.loadMunic();
        this.loadCorregVeredas();
        this.nomCorregVeredasubs();
        this.storageService.add('photoUser', this.usuario.foto);
        this.storageService.add(
          'nomApell',
          this.getNomApell(this.usuario.nombres, this.usuario.apellidos)
        );
        if (
          !this.usuario.tipo_usuario ||
          !(this.usuario.nombres && this.usuario.apellidos)
        ) {
          this.router.navigate(['/welcome', this.usuario]);
        }
        this.us.setAuthUserPhoto(this.usuario.foto);
        this.markerPosition = {
          lat: parseFloat(this.latitud?.value),
          lng: parseFloat(this.longitud?.value),
        };


      },
      (err) => {
        console.log(err);
      }
    );
  }


  openAddFileDialog() {
    const element: HTMLElement = this.inputFileDialog.nativeElement;
    element.click();
  }

  fileChange(event: any) {
    this.fileName = '/perfil/user_' + this.id?.value;
    this.file = event.target.files[0];
    this.storage
      .cloudStorageTask(this.fileName, this.file)
      .percentageChanges()
      .subscribe((response) => {
        console.log(response);
        this.percentUploaded = response;
      });
    this.storage
      .cloudStorageRef(this.fileName)
      .getDownloadURL()
      .subscribe(
        (downloadUrl) => {
          console.log(downloadUrl);
          this.us
            .actualizarUsuario(this.id?.value, { foto: downloadUrl })
            .subscribe(
              (response) => {
                this.usuario.foto = downloadUrl;
                this.us.setAuthUserPhoto(this.usuario.foto);
              },
              (err) => {
                console.log(err);
              }
            );
        },
        (err) => {
          console.log(err);
        }
      );
  }

  nomCorregVeredasubs() {
    this.nomCorreg?.valueChanges.subscribe((response) => {
      console.log(response);
      this.idCorreg?.patchValue(0, { emitEvent: false });
      this.idCorreg?.updateValueAndValidity();
    });

    this.nomVereda?.valueChanges.subscribe((response) => {
      console.log(response);
      this.idVereda?.patchValue(0, { emitEvent: false });
      this.idVereda?.updateValueAndValidity();
    });
  }

  getNomApell(nombres: string, apellidos: string) {
    let nomComp: string = '';
    if (nombres) {
      nomComp = nombres.split(' ')[0];
    }
    if (apellidos) {
      nomComp = nomComp + ' ' + apellidos.split(' ')[0];
    }
    return nomComp;
  }

  loadAreasExp() {
    this.aes.getAreasDeExperticia().subscribe(
      (response) => {
        this.areas = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
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

  loadMunic() {
    this.places
      .getMunicipiosDepartamentos(this.form.get('id_departamento')?.value)
      .subscribe(
        (response) => {
          this.municipios = response.data;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  changeDpto() {
    this.form.get('id_municipio')?.setValue(0);
    this.places
      .getMunicipiosDepartamentos(this.form.get('id_departamento')?.value)
      .subscribe(
        (response) => {
          this.municipios = response.data;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  changeMunic() {
    this.idCorreg?.setValue(0);
    this.idVereda?.setValue(0);
    this.places.getCorregimientosMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.corregimientos = response.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this.places.getVeredasMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.veredas = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadCorregVeredas() {
    this.places.getCorregimientosMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.corregimientos = response.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this.places.getVeredasMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.veredas = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit() {
    console.log('form-->', this.form.value);
    console.log('lat ', this.latitud?.value);
    this.latitud?.enable();
    this.longitud?.enable();
    this.loading = true;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }

    this.us
      .actualizarUsuario(this.form.get('id')?.value, this.form.getRawValue())
      .subscribe(
        (response) => {
          console.log(response);
          this.loading = false;
          this.latitud?.disable();
          this.longitud?.disable();
        },
        (err) => {
          this.loading = false;
          console.log(err);
          this.latitud?.disable();
          this.longitud?.disable();
        }
      );
  }

  corregSelected() {
    this.nomCorreg?.setValue('');
  }

  veredaSelected() {
    this.nomVereda?.setValue('');
  }

  onAreaExpChange() {
    console.log('area experticia change');
    if (this.idAreaExpert?.value !== -1) {
      this.otraAreaExp?.setValue('');
      this.otraAreaExpDesc?.setValue('');
    }
  }

  // Metodo para adicionar una marca en el mapa
  addMarker(event: google.maps.MapMouseEvent) {

    const point: google.maps.LatLngLiteral = {
      lat: event.latLng?.toJSON().lat!,
      lng: event.latLng?.toJSON().lng!,
    };
    this.places.geocodeLatLng(point).then((response) => {
      if (response.status == 'OK') {
        let result = response.results[0].address_components;
        let index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_1')
        );
        let dpto = result[index].short_name;
        index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_2')
        );
        let municipio = result[index].short_name;

        index = this.departamentos.findIndex(
          (element) => element.nombre_departamento == dpto
        );
        let idDpto = this.departamentos[index]?.id_departamento;
        index = this.municipios.findIndex(
          (element) => element.nombre == municipio
        );
        let idMunic = this.municipios[index]?.id_municipio;

        if (dpto == 'Sucre') {
          this.fueraDirecion = false
          this.confirmModalMapService
            .confirm(
              '../../../../assets/icons/editar.svg',
              '../../../../assets/icons/save.svg',
              'Actualizar  mi ubicación',
              'Estás a punto de cambiar tu ubicación, ¿estás seguro de realizar este cambio?',
              'Si',
              'No estoy seguro'
            )
            .then((result) => {
              if (result == true) {
                this.idDpto?.setValue(idDpto);
                this.idMunic?.setValue(idMunic);
                this.direccion?.setValue(response.results[0].formatted_address);
                if (event.latLng) {
                  this.markerPosition = event.latLng.toJSON();
                  this.latitud?.setValue(event.latLng.toJSON().lat);
                  this.longitud?.setValue(event.latLng.toJSON().lng);
                }
                this.onSubmit()
              }
            })
            .catch((result) => {});
        } else {
          this.fueraDirecion = true;
           this.noexistendatos=false
          setTimeout(() => {
            this.fueraDirecion = false;
          }, 5000);
        }
      }
    });
  }
  verMap() {
    const instructionsElement = document.createElement("p");

        const sucreColombia = {
          north: 10.184454,
          south: 8.136442,
          west: -75.842392,
          east: -74.324908,
        };
        this.options = {
          center: {
            lat: parseFloat(this.latitud?.value),
            lng: parseFloat(this.longitud?.value),
          },
          restriction: {
            latLngBounds: sucreColombia,
            strictBounds: false,
          },
          zoom: 12,
          scrollwheel: true,
        };
    this.markerPosition = {
      lat: parseFloat(this.latitud?.value),
      lng: parseFloat(this.longitud?.value),
    };
     this.modalService.open(this.map, { size: 'xl',centered: true,windowClass: 'dark-modal'}

     ).result.then((result) => {
         console.log("se cerro modal ",result)
        } ).catch((err) => {
        console.log(err);
      });
    this.buscarx = '';
  }

  buscar() {
    this.loadingseart=true
    const valor = this.buscarx;
    this.valorbuscarx=this.buscarx
    if (valor.trim().length == 0) {
      this.loadingseart=false
      return;
    }
    this.geocoder
      .geocode({
        address: `${valor}`,
      })
      .subscribe(({ results }) => {
        if (results.length===0 ) {
 this.loadingseart=false
   this.noexistendatos=true
    this.fueraDirecion=false
    setTimeout(() => {
     this.noexistendatos=false
   }, 10000);
        }else{
          this.loadingseart=false
          this.fueraDirecion=false
           const point: google.maps.LatLngLiteral = {
          lat: results[0].geometry.location.toJSON().lat!,
          lng: results[0].geometry.location.toJSON().lng!,
        };
        this.places.geocodeLatLng(point).then((response) => {
          if (response.status == 'OK') {
            let result = response.results[0].address_components;
            let index = result.findIndex((element) =>
              element.types.includes('administrative_area_level_1')
            );
            let dpto = result[index].short_name;
            index = result.findIndex((element) =>
              element.types.includes('administrative_area_level_2')
            );
            index = this.departamentos.findIndex(
              (element) => element.nombre_departamento == dpto
            );
            if (dpto == 'Sucre') {
              if (
                results[0].geometry.location.toJSON().lat! &&
                results[0].geometry.location.toJSON().lng!
              ) {
                this.options = {
                  center: {
                    lat: results[0].geometry.location.toJSON().lat!,
                    lng: results[0].geometry.location.toJSON().lng!,
                  },
                  zoom: 13,
                };
              }
            } else {
              this.loadingseart=false
              this.fueraDirecion = true;
               this.noexistendatos=false
              setTimeout(() => {
                this.fueraDirecion = false;
              }, 5000);
            }
          }
        });
        }

      });
  }

  borrarBusqueda(){
     this.buscarx = ''
     this.borrarseart=false
     this.fueraDirecion = false;
     this.noexistendatos=false
  }
   onKey(event:any){
    if (event.target.value !== '' ) {
      this.borrarseart=true
    }else if(event.target.value == ''){
     this.borrarseart=false
    }
  }

  mostrarPorTipo(campo: string) {
    let index = -1;

    let tipoUsuario = this.usuario?.tipo_usuario;

    if (tipoUsuario == 'Investigador Experto') {
      tipoUsuario = 'investigadorexperto';
    }
    index = this.campos[tipoUsuario?.toLowerCase()]?.indexOf(campo);
    return index > -1;
  }

  get id() {
    return this.form.get('id');
  }

  get cedula() {
    return this.form.get('cedula');
  }

  get nombres() {
    return this.form.get('nombres');
  }

  get apellidos() {
    return this.form.get('apellidos');
  }

  get celular() {
    return this.form.get('celular');
  }

  get direccion() {
    return this.form.get('direccion');
  }

  get idTipoUsuario() {
    return this.form.get('id_tipo_usuario');
  }

  get email() {
    return this.form.get('email');
  }

  get idAreaExpert() {
    return this.form.get('id_area_experticia');
  }

  get nombreNegocio() {
    return this.form.get('nombre_negocio');
  }

  get foto() {
    return this.form.get('foto');
  }

  get fechaRegistro() {
    return this.form.get('fecha_registro');
  }

  get fechaNac() {
    return this.form.get('fecha_nacimiento');
  }

  get nomVereda() {
    return this.form.get('nombre_vereda');
  }

  get idDpto() {
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get idCorreg() {
    return this.form.get('id_corregimiento');
  }

  get idVereda() {
    return this.form.get('id_vereda');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get nomCorreg() {
    return this.form.get('nombre_corregimiento');
  }

  get otraAreaExp() {
    return this.form.get('otra_area_experticia');
  }

  get otraAreaExpDesc() {
    return this.form.get('otra_area_experticia_descripcion');
  }

 /*  currentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.options = {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        zoom: 10,
      };
      this.markerPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.latitud?.setValue(position.coords.latitude);
      this.longitud?.setValue(position.coords.longitude);
    });
  } */
}
