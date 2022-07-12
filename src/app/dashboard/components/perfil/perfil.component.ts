import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
import { AppModalService } from '../../../shared/services/app-modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { vertices } from '../../../global/constants';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  @ViewChild('map') map: any;
  usuario: any;
  @ViewChild('fileInput') inputFileDialog!: ElementRef;

  buscarx: string = '';
  fueraDirecion: boolean = false;
  loading: boolean = false;
  loadingPhoto: boolean = false;
  loadingseart: boolean = false;
  noexistendatos: boolean = false;
  borrarseart: boolean = false;
  valorbuscarx: string = '';
  areas: Array<any> = [];
  departamentos: Array<any> = [];
  municipios: Array<any> = [];
  corregimientos: Array<any> = [];
  veredas: Array<any> = [];
  tempDir: string = '';
  tempMunicId: number = -1;
  isOpenMap: boolean = false;
  mylatitudidmunicipio!: number;
  mylongitudidmunicipio!: number;
  faltadireccion: boolean = false;
  escogerdireccion: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    cedula: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    celular: new FormControl(''),
    direccion: new FormControl(''),
    informacion_adicional_direccion: new FormControl(''),
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
  validateInputFormObject: any[] = [
    {
      apellidos: false,
      cedula: false,
      celular: false,
      direccion: false,
      email: false,
      fecha_nacimiento: false,
      fecha_registro: false,
      foto: false,
      id: false,
      id_area_experticia: false,
      id_corregimiento: false,
      id_departamento: false,
      id_municipio: false,
      id_tipo_usuario: false,
      id_vereda: false,
      informacion_adicional_direccion: false,
      latitud: false,
      longitud: false,
      nombre_corregimiento: false,
      nombre_negocio: false,
      nombre_vereda: false,
      nombres: false,
      otra_area_experticia: false,
      otra_area_experticia_descripcion: false,
      sobre_mi: false,
    },
  ];
  validateInputFormObjectFalse: any[] = [
    {
      apellidos: false,
      cedula: false,
      celular: false,
      direccion: false,
      email: false,
      fecha_nacimiento: false,
      fecha_registro: false,
      foto: false,
      id: false,
      id_area_experticia: false,
      id_corregimiento: false,
      id_departamento: false,
      id_municipio: false,
      id_tipo_usuario: false,
      id_vereda: false,
      informacion_adicional_direccion: false,
      latitud: false,
      longitud: false,
      nombre_corregimiento: false,
      nombre_negocio: false,
      nombre_vereda: false,
      nombres: false,
      otra_area_experticia: false,
      otra_area_experticia_descripcion: false,
      sobre_mi: false,
    },
  ];

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
  municipiocambiado: boolean = false;
  editarperfil: boolean = false;
  mensajedirecion!: string;
  EditedInputValue: boolean = false;
  canceladoedir: boolean = false;
  photoDelate: boolean=false;
  photoUpdate: boolean=false
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
    private appModalService: AppModalService,
    private modalService: NgbModal
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
    this.nombres?.disable();
    this.cedula?.disable();
    this.apellidos?.disable();
    this.celular?.disable();
    this.informacion_adicional_direccion?.disable();
    this.nombre_corregimiento?.disable();
    this.idMunic?.disable();
    this.direccion?.disable();
    this.idAreaExpert?.disable();
    this.sobre_mi?.disable();
    this.otraAreaExp?.disable()
    this.otraAreaExpDesc?.disable()
    this.latitud?.disable();
    this.longitud?.disable();
    this.email?.disable();
    registerLocaleData(es);
    let email: string | null = localStorage.getItem('email');
    this.us.getUsuarioByEmail(email).subscribe(
      (response) => {
        /* console.log('usuario por email ', response); */
        this.usuario = response.data[0];
        console.log(this.usuario)
        this.form.get('id')?.setValue(this.usuario.id);
        this.form.get('cedula')?.setValue(this.usuario.cedula);
        this.form.get('nombres')?.setValue(this.usuario.nombres);
        this.form.get('apellidos')?.setValue(this.usuario.apellidos);
        this.form.get('celular')?.setValue(this.usuario.celular);
        this.form.get('direccion')?.setValue(this.usuario.direccion);
        this.form
          .get('informacion_adicional_direccion')
          ?.setValue(this.usuario.informacion_adicional_direccion);
        this.form
          .get('id_tipo_usuario')
          ?.setValue(this.usuario.id_tipo_usuario);
        this.form.get('email')?.setValue(this.usuario.email);
        this.form
          .get('id_area_experticia')
          ?.setValue(this.usuario.id_area_experticia);
        this.form.get('sobre_mi')?.setValue(this.usuario.sobre_mi);
        this.form.get('nombre_negocio')?.setValue(this.usuario.nombre_negocio);
        this.form.get('foto')?.setValue(this.usuario.foto);
        this.form
          .get('fecha_registro')
          ?.setValue(Utilities.dateToISOString(this.usuario.fecha_registro));
        this.form
          .get('fecha_nacimiento')
          ?.setValue(Utilities.dateToISOString(this.usuario.fecha_nacimiento));
        this.form.get('nombre_vereda')?.setValue(this.usuario.nombre_vereda);

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

        if (this.usuario.id_departamento == 0 || this.usuario.id_departamento == null) {
          this.form.get('id_departamento')?.setValue(70);
        } else {
          this.form
            .get('id_departamento')
            ?.setValue(this.usuario.id_departamento);
        }
        this.form.get('id_municipio')?.setValue(this.usuario.id_municipio);
        this.idDpto?.disable();
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

          this.tempDir = this.form.get('direccion')?.value;
          this.tempMunicId = this.form.get('id_municipio')?.value;

      },
      (err) => {
        console.log(err);
      }
    );
  }
  myNgOnInit() {
    this.direccion?.disable();
    this.nombres?.disable();
    this.cedula?.disable();
    this.apellidos?.disable();
    this.celular?.disable();
    this.informacion_adicional_direccion?.disable();
    this.nombre_corregimiento?.disable();
    this.idMunic?.disable();
    this.idAreaExpert?.disable();
    this.sobre_mi?.disable()
    this.otraAreaExp?.disable();
    this.otraAreaExpDesc?.disable();
    this.form.get('id')?.setValue(this.usuario.id);
    this.form.get('cedula')?.setValue(this.usuario.cedula);
    this.form.get('nombres')?.setValue(this.usuario.nombres);
    this.form.get('apellidos')?.setValue(this.usuario.apellidos);
    this.form.get('celular')?.setValue(this.usuario.celular);
    this.form.get('direccion')?.setValue(this.usuario.direccion);
    this.form
      .get('informacion_adicional_direccion')
      ?.setValue(this.usuario.informacion_adicional_direccion);
    this.form.get('id_tipo_usuario')?.setValue(this.usuario.id_tipo_usuario);
    this.form.get('email')?.setValue(this.usuario.email);
    this.form
      .get('id_area_experticia')
      ?.setValue(this.usuario.id_area_experticia);
      this.form.get('sobre_mi')?.setValue(this.usuario.sobre_mi);
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
    this.form.get('id_corregimiento')?.setValue(this.usuario.id_corregimiento);
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
  }

  openAddFileDialog() {
    const element: HTMLElement = this.inputFileDialog.nativeElement;
    element.click();
  }

  uploadToServer(file: any) {
    let fileName = '/perfil/user_' + this.id?.value;
    console.log(fileName);
    console.log(file);
    this.storage
      .cloudStorageTask(fileName, file)
      .percentageChanges()
      .subscribe((response) => {
        console.log(response);
        this.percentUploaded = response;
        if (this.percentUploaded == 100) {
          this.storage
            .cloudStorageRef(fileName)
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
                      this.loadingPhoto = false;
                      this.photoUpdate=true
                                      setTimeout(() => {
                                        this.photoUpdate = false;
                                        /* window.location.reload(); */
                                      }, 3000);

                    },
                    (err) => {
                      this.loadingPhoto = false;
                       this.photoUpdate = false;
                      console.log(err);
                    }
                  );
              },
              (err) => {
                this.loadingPhoto = false;
                 this.photoUpdate = false;
                console.log(err);
              }
            );
        }
      });
  }
delatePhotoPerfil(){
     let fileName = '/perfil/user_' + this.id?.value;
     this.storage.deletephotoPerfil(fileName).subscribe(
       (result) => {
          this.us
            .actualizarUsuario(this.id?.value, { foto: '' })
            .subscribe(
              (response) => {
                this.usuario.foto = '';
                this.us.setAuthUserPhoto(this.usuario.foto);
                this.storageService.add('photoUser', '');
                this.photoDelate=true
                this.usuario
                setTimeout(() => {
                  this.photoDelate = false;
                  window.location.reload();
                }, 3000);
              },
              (err) => {
                this.photoDelate = false;
                console.log(err);
              }
            );

       },
       (err) => {
         console.log(err);
       }
     );

  }
  async fileChange(event: any) {
    this.loadingPhoto = true;
    const imageFile = event.target.files[0];
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        'compressedFile instanceof Blob',
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      await this.uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  }

  nomCorregVeredasubs() {
    this.nomCorreg?.valueChanges.subscribe((response) => {
      this.idCorreg?.patchValue(0, { emitEvent: false });
      this.idCorreg?.updateValueAndValidity();
    });

    this.nomVereda?.valueChanges.subscribe((response) => {
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
        console.log(this.areas)
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
        console.log(this.departamentos)
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
          console.log(this.municipios)
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
  invalid(datos: any) {
    if (!this.form.get('direccion')?.value) {
      console.log(this.usuario.direccion);
      console.log(datos);
      this.faltadireccion = true;
    } else {
      console.log(this.usuario.direccion);
      console.log(datos);
      this.faltadireccion = false;
    }
  }

  changeMunic() {
    this.municipiocambiado = true;
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
    this.places
      .getMunicipioById(this.form.get('id_municipio')?.value)
      .subscribe(
        (response) => {
          if (response.data != 0) {
            this.mylatitudidmunicipio = Number(response.data[0].latitud);
            this.mylongitudidmunicipio = Number(response.data[0].longitud);
            if (this.idMunic?.value == this.tempMunicId) {
              this.direccion?.setValue(this.tempDir);
            } else if (!this.isOpenMap) {
              this.verMap();
              if (!this.canceladoedir) {
                this.direccion?.setValue('');
              }
              this.escogerdireccion = true;
              setTimeout(() => {
                this.escogerdireccion = false;
              }, 30000);
            }
          }
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
    this.latitud?.enable();
    this.longitud?.enable();
    this.loading = true;
    this.editarperfil = false;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }
    console.log('usuario ', this.form.getRawValue());
    /*  console.log('id ', this.form.get('id')?.value); */
    this.us
      .actualizarUsuario(this.form.get('id')?.value, this.form.getRawValue())
      .subscribe(
        (response) => {
          console.log(response);
          this.loading = false;
          this.latitud?.disable();
          this.longitud?.disable();

          this.nombres?.disable();
          this.cedula?.disable();
          this.apellidos?.disable();
          this.celular?.disable();
          this.informacion_adicional_direccion?.disable();
          this.nombre_corregimiento?.disable();
          this.idMunic?.disable();
           this.idAreaExpert?.disable();
           this.sobre_mi?.disable();
           this.otraAreaExp?.disable();
          this.otraAreaExpDesc?.disable();
          this.mensajedirecion = '';
          this.EditedInputValue = false;
          this.validateInputFormObject.forEach((o) => {
            let claves = Object.keys(o);
            for (let i = 0; i < claves.length; i++) {
              let clave: any = claves[i];
              o[clave] = false;
            }
          });
          this.appModalService
            .modalAlertActualizadoComponent('Perfil actualizado correctamente')
            .then((result) => {})
            .catch((result) => {});
        },
        (err) => {
          this.loading = false;
          console.log(err);
          this.latitud?.disable();
          this.longitud?.disable();
          this.nombres?.disable();
          this.cedula?.disable();
          this.apellidos?.disable();
          this.celular?.disable();
          this.informacion_adicional_direccion?.disable();
          this.nombre_corregimiento?.disable();
          this.idMunic?.disable();
           this.idAreaExpert?.disable();
           this.sobre_mi?.disable();
               this.otraAreaExp?.disable();
               this.otraAreaExpDesc?.disable();
          this.mensajedirecion = '';
          this.EditedInputValue = false;
          this.validateInputFormObject.forEach((o) => {
            let claves = Object.keys(o);
            for (let i = 0; i < claves.length; i++) {
              let clave: any = claves[i];
              o[clave] = false;
            }
          });
          this.appModalService
            .modalAlertActualizadoComponent(
              'Parece que hubo un error al actualizar el perfil, por favor inténtalo de nuevo'
            )
            .then((result) => {})
            .catch((result) => {});
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
      if (this.usuario.id_area_experticia !== this.idAreaExpert?.value) {
        this.validateInputFormObject.forEach((o) => {
          o.id_area_experticia = true;
        });
        if (
          JSON.stringify(this.validateInputFormObject) !==
          JSON.stringify(this.validateInputFormObjectFalse)
        ) {
          this.EditedInputValue = true;
        } else {
          this.EditedInputValue = false;
        }
      } else{
        this.EditedInputValue = false;
                this.validateInputFormObject.forEach((o) => {
                  o.id_area_experticia = false;
                });
      }
    }
  }

  // Metodo para adicionar una marca en el mapa
  addMarker(event: google.maps.MapMouseEvent) {
    this.escogerdireccion = false;
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
          this.markerPosition = point;
          this.fueraDirecion = false;
          this.confirmModalMapService
            .confirm(
              '../../../../assets/icons/editar.svg',
              '../../../../assets/icons/save.svg',
              'Actualizar  mi ubicación',
              'Estás a punto de cambiar tu ubicación por: ',
              'Si',
              'No estoy seguro',
              `${response.results[0].formatted_address}`
            )
            .then((result) => {
              if (result == true) {
                this.idDpto?.setValue(idDpto);
                this.idMunic?.setValue(idMunic);
                this.direccion?.setValue(response.results[0].formatted_address);
                this.tempDir = this.direccion?.value;
                this.tempMunicId = this.idMunic?.value;
                this.foto?.setValue('')
                if (event.latLng) {
                  this.markerPosition = event.latLng.toJSON();
                  this.latitud?.setValue(event.latLng.toJSON().lat);
                  this.longitud?.setValue(event.latLng.toJSON().lng);
                }
                this.validateInputFormObject.forEach((o) => {
                  o.latitud = true;
                  o.longitud = true;
                });
                if (
                  JSON.stringify(this.validateInputFormObject) !==
                  JSON.stringify(this.validateInputFormObjectFalse)
                ) {
                  this.EditedInputValue = true;
                } else {
                  this.EditedInputValue = false;
                }
              } else {
                this.validateInputFormObject.forEach((o) => {
                  o.latitud = false;
                  o.longitud = false;
                });
                this.options = {
                  center: {
                    lat: parseFloat(this.latitud?.value),
                    lng: parseFloat(this.longitud?.value),
                  },
                  zoom: 12,
                  scrollwheel: true,
                };
                this.markerPosition = {
                  lat: parseFloat(this.latitud?.value),
                  lng: parseFloat(this.longitud?.value),
                };
              }
            })
            .catch((result) => {
              this.validateInputFormObject.forEach((o) => {
                o.latitud = false;
                o.longitud = false;
              });
              this.options = {
                center: {
                  lat: parseFloat(this.latitud?.value),
                  lng: parseFloat(this.longitud?.value),
                },
                zoom: 12,
                scrollwheel: true,
              };
              this.markerPosition = {
                lat: parseFloat(this.latitud?.value),
                lng: parseFloat(this.longitud?.value),
              };
            });
        } else {
          this.fueraDirecion = true;
          this.noexistendatos = false;
          setTimeout(() => {
            this.fueraDirecion = false;
          }, 5000);
        }
      }
    });
  }
  verMap() {
    if (this.editarperfil) {
      const sucreColombia = {
        north: 10.184454,
        south: 8.136442,
        west: -75.842392,
        east: -74.324908,
      };
      this.modalService
        .open(this.map, {
          size: 'xl',
          centered: true,
          windowClass: 'dark-modal',
        })
        .result.then((result) => {
          this.isOpenMap = false;
          this.municipiocambiado = false;
          if (!this.form.get('direccion')?.value && this.usuario.direccion) {
            console.log(this.usuario.direccion);
            console.log(this.form.get('direccion')?.value);
            this.form.get('direccion')?.setValue(this.tempDir);
            this.form.get('id_municipio')?.setValue(this.tempMunicId);
            this.form.get('latitud')?.setValue(this.latitud?.value);
            this.form.get('longitud')?.setValue(this.longitud?.value);
          }
        })
        .catch((err) => {
          this.isOpenMap = false;
          this.municipiocambiado = false;
          if (!this.form.get('direccion')?.value && this.usuario.direccion) {
            console.log(this.usuario.direccion);
            console.log(this.form.get('direccion')?.value);
            this.form.get('direccion')?.setValue(this.tempDir);
            this.form.get('id_municipio')?.setValue(this.tempMunicId);
            this.form.get('latitud')?.setValue(this.latitud?.value);
            this.form.get('longitud')?.setValue(this.longitud?.value);
          }
          console.log(err);
        });
      this.isOpenMap = true;
      if (this.municipiocambiado) {
        this.options = {
          center: {
            lat: this.mylatitudidmunicipio,
            lng: this.mylongitudidmunicipio,
          },
          restriction: {
            latLngBounds: sucreColombia,
            strictBounds: false,
          },
          zoom: 14,
          scrollwheel: true,
        };
   /*      this.markerPosition = {
          lat: this.mylatitudidmunicipio,
          lng: this.mylongitudidmunicipio,
        }; */
      } else {
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
      }
    }
  }

  buscar() {
    this.loadingseart = true;
    const valor = this.buscarx;
    console.log(valor);
    this.valorbuscarx = this.buscarx;
    if (valor.trim().length == 0) {
      this.loadingseart = false;
      return;
    }
    this.geocoder
      .geocode({
        address: `${valor}`,
      })
      .subscribe(({ results }) => {
        if (results.length === 0) {
          this.loadingseart = false;
          this.noexistendatos = true;
          this.fueraDirecion = false;
          setTimeout(() => {
            this.noexistendatos = false;
          }, 10000);
        } else {
          this.loadingseart = false;
          this.fueraDirecion = false;
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
                this.loadingseart = false;
                this.fueraDirecion = true;
                this.noexistendatos = false;
                setTimeout(() => {
                  this.fueraDirecion = false;
                }, 5000);
              }
            }
          });
        }
      });
  }

  borrarBusqueda() {
    this.buscarx = '';
    this.borrarseart = false;
    this.fueraDirecion = false;
    this.noexistendatos = false;
  }
  onKey(event: any) {
    if (event.target.value !== '') {
      this.borrarseart = true;
    } else if (event.target.value == '') {
      this.borrarseart = false;
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
  onKeyInput(evento: any, nombreinput?: any, usuarionombreinput?: any) {
    let valor = evento.key.indexOf(' ');
    let valor_code = evento.code;
    let valor_sin_espacios = evento.target.value.replace(/\s+/g, '');
    if (
      (evento.target.value !== usuarionombreinput &&
        evento.key !== ' ' &&
        evento.key !== 'Backspace') ||
      (evento.target.value !== usuarionombreinput &&
        evento.key === 'Backspace' &&
        valor == 0) ||
      (valor_sin_espacios !== usuarionombreinput &&
        evento.key === 'Backspace' &&
        valor == -1)
    ) {
      this.validateInputFormObject.forEach((o) => (o[nombreinput] = true));
      if (
        JSON.stringify(this.validateInputFormObject) !==
        JSON.stringify(this.validateInputFormObjectFalse)
      ) {
        this.EditedInputValue = true;
      } else {
        this.EditedInputValue = false;
      }
    }

    if (
      evento.target.value === usuarionombreinput ||
      (valor_sin_espacios === usuarionombreinput &&
        valor === 0 &&
        valor_code === 'Space') ||
      (valor_sin_espacios === usuarionombreinput && valor === -1)
    ) {
      this.validateInputFormObject.forEach((o) => (o[nombreinput] = false));
      if (
        JSON.stringify(this.validateInputFormObject) !==
        JSON.stringify(this.validateInputFormObjectFalse)
      ) {
        this.EditedInputValue = true;
      } else {
        this.EditedInputValue = false;
      }
    }
  }
  editarPerfi() {
    this.editarperfil = true;
    this.mensajedirecion = 'Escoge o mira aquí tu direción';
    this.nombres?.enable();
    this.cedula?.enable();
    this.apellidos?.enable();
    this.celular?.enable();
    this.informacion_adicional_direccion?.enable();
    this.nombre_corregimiento?.enable();
    this.idMunic?.enable();
     this.idAreaExpert?.enable();
     this.sobre_mi?.enable();
     this.otraAreaExp?.enable();
    this.otraAreaExpDesc?.enable();
  }
  cancelProfileEditing() {
    if (
      JSON.stringify(this.validateInputFormObject) !==
      JSON.stringify(this.validateInputFormObjectFalse)
    ) {
      this.confirmModalMapService
        .confirm(
          '../../../../assets/icons/editar.svg',
          '../../../../assets/icons/save.svg',
          'Cancelar edicion del perfil',
          'Estás apunto de cancelar la edición',
          'Si',
          'No estoy seguro',
          ``
        )
        .then((result) => {
          if (result == true) {
            this.canceladoedir = true;
            this.mensajedirecion = '';
            this.EditedInputValue = false;
            this.editarperfil = false;
            this.validateInputFormObject.forEach((o) => {
              let claves = Object.keys(o);
              for (let i = 0; i < claves.length; i++) {
                let clave: any = claves[i];
                o[clave] = false;
              }
            });
            console.log(this.validateInputFormObject);
            this.myNgOnInit();
          } else {
            this.EditedInputValue = true;
            this.editarperfil = true;
          }
        })
        .catch((result) => {
          this.EditedInputValue = true;
          this.editarperfil = true;
        });
    } else {
      this.editarperfil = false;
      this.nombres?.disable();
      this.cedula?.disable();
      this.apellidos?.disable();
      this.celular?.disable();
      this.informacion_adicional_direccion?.disable();
      this.nombre_corregimiento?.disable();
      this.idMunic?.disable();
      this.idAreaExpert?.disable();
      this.sobre_mi?.disable();
      this.otraAreaExp?.disable();
      this.otraAreaExpDesc?.disable();
    }
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
  get informacion_adicional_direccion() {
    return this.form.get('informacion_adicional_direccion');
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
  get nombre_corregimiento() {
    return this.form.get('nombre_corregimiento');
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
  get sobre_mi() {
    return this.form.get('sobre_mi');
  }

  get otraAreaExpDesc() {
    return this.form.get('otra_area_experticia_descripcion');
  }
}
