import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
import { NegociosService } from 'src/app/services/negocios.service';
import { PlatformLocation } from '@angular/common';
import { ComunicacionEntreComponentesService } from '../../../shared/services/comunicacion-entre-componentes.service';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';

@Component({
  selector: 'app-negocio-dtalle-form',
  templateUrl: './negocio-dtalle-form.component.html',
  styleUrls: ['./negocio-dtalle-form.component.scss'],
})
export class NegocioDtalleFormComponent implements OnInit, OnDestroy {
  @ViewChild('map') map: any;
  modalMode: string = 'update';
  negocio: any;
  photosNegocioArray: Array<string | SafeUrl> = [];
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  filesfinalCreate: any[] = [];
  loading1: boolean = false;
  loadingphoto: boolean = false;
  cargandodata: boolean = false;
  authUserId: number = -1;
  /* Mapa variables */
  apiLoaded: Observable<boolean>;
  mylatitudidmunicipio!: number;
  mylongitudidmunicipio!: number;
  modal!: NgbModalRef;
  guarlatlog: boolean = false;
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  noexistendatos: boolean = false;
  escogerdireccion: boolean = false;
  faltanargumentos: boolean = false;
  faltadireccion: boolean = false;
  buscarx: string = '';
  valorbuscarx: string = '';
  vertices = vertices;
  options: google.maps.MapOptions = {
    scrollwheel: true,
    center: { lat: 0, lng: 0 },
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };
  inputOn: boolean = true;
  /* form declaraciones*/
  form: FormGroup = new FormGroup({
    nombre_negocio: new FormControl('',[Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    informacion_adicional_direccion: new FormControl(''),
    latitud: new FormControl(0, [Validators.required]),
    longitud: new FormControl(0, [Validators.required]),
    descripcion_negocio: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
  });
  id_negocio!: number;
  constructor(
    private negociosService: NegociosService,
    private modalService: NgbModal,
    httpClient: HttpClient,
    private geocoder: MapGeocoder,
    private confirmModalMapService: ConfirmModalMapService,
    private storage: FirebaseStorageService,
    private places: PlacesService,
    private ar: ActivatedRoute,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService,
    private compressImageSizeService: CompressImageSizeService
  ) {
    this.apiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=' + environment.mapsApiKey,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
  /* agregar esto para camcelar el subscribe de  comunicacionEntreComponentesService*/
  public changeArray!: Subscription;
  public ArrayDelate!: Subscription;
  ngOnInit(): void {
    registerLocaleData(es);
    this.negocio = this.ar.snapshot.params;
    console.log(this.negocio);
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    this.prepareForm();
    this.loadDptos();
    /* escucha el componente que carga los files desde la modal */
    this.changeArray =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (arrayFiles) => {
          if (arrayFiles.length > 0) {
            if (this.modalMode == 'create') {
              if (arrayFiles[0].length > 0) {
                for (let index = 0; index < arrayFiles[0].length; index++) {
                  const element = arrayFiles[0][index];
                  this.photosNegocioArray = arrayFiles[0];
                  console.log(this.photosNegocioArray);
                }
              } else {
                this.photosNegocioArray = [];
              }
              for (let index = 0; index < arrayFiles[1].length; index++) {
                const element = arrayFiles[1][index];
                this.filesfinalCreate.push(element);
              }
              for (let index = 0; index < arrayFiles[2].length; index++) {
                const element = arrayFiles[2][index];
                this.filesfinalCreate.splice(element, 1);
              }
              console.log(this.photosNegocioArray);
              console.log(this.filesfinalCreate);
            } else if (this.modalMode == 'update') {
              console.log('files ngOnlnit update');
              console.log(arrayFiles);
              this.loadPhotos(arrayFiles);
            }
          }
        }
      );
    this.ArrayDelate =
      this.comunicacionEntreComponentesService.ArrayDelate.subscribe(
        (arrayFotoDelate) => {
          this.photosDelete(arrayFotoDelate);
        }
      );
  }

  ngOnDestroy(): void {
    /* cancelamos las subcripciones del servicio */
    this.changeArray?.unsubscribe();
    this.ArrayDelate?.unsubscribe();
  }

  addNegocio() {
    this.loading1 = true;
    if (!this.form.valid) {
      if (this.form.getRawValue().direccion == '') {
        this.faltadireccion = true;
      } else {
        this.faltadireccion = false;
      }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    if (this.form.getRawValue().direccion !== '') {
      this.form.disable();
      this.cargandodata = true;
      this.faltadireccion = false;
      console.log(this.form.getRawValue());
      this.negociosService.addNegocio(this.form.getRawValue()).subscribe(
        (response) => {
          console.log(response);
          this.id_negocio = response.body.insertId;
          if (this.filesfinalCreate.length !== 0) {
            this.loadPhotos(this.filesfinalCreate);
            this.loadingphoto = true;
          } else {
            this.loading1 = false;
            this.goBack();
          }
        },
        (err) => {
          this.goBack();
          this.form.enable();
          this.cargandodata = false;
          this.loading1 = false;
          console.log(err);
        }
      );
    } else {
      this.loading1 = false;
      this.faltadireccion = true;
    }
  }

  updateNegocio() {
    this.loading1 = true;
    if (!this.form.valid) {
      if (this.form.getRawValue().direccion == '') {
        this.faltadireccion = true;
      } else {
        this.faltadireccion = false;
      }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    if (this.form.getRawValue().direccion !== '') {
      this.form.disable();
      this.cargandodata = true;
      this.faltadireccion = false;
      console.log(this.form.getRawValue());
      this.negociosService
        .updateNegocio(Number(this.negocio.id_negocio), this.form.getRawValue())
        .subscribe(
          (response) => {
            console.log(response);
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            this.goBack();
            this.form.enable();
            this.cargandodata = false;
            console.log(err);
            this.loading1 = false;
          }
        );
    } else {
      this.loading1 = false;
      this.faltadireccion = true;
    }
  }

  loadDptos() {
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.departamentos = response.data;
        this.idDpto?.setValue(70);
        this.idDpto?.disable();
        this.loadMunic();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loadMunic() {
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response) => {
        this.municipios = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  initForm() {
    this.idmunicipioselec();
    this.direccion?.setValue('');
    this.latitud?.setValue(0);
    this.longitud?.setValue(0);
    this.descripcion?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
  }
  prepareForm() {
    this.faltanargumentos = false;
    this.faltadireccion = false;
    this.id_negocio = -1;
    this.form.reset();
    this.initForm();
    this.idDpto?.setValue(70);
    if (this.modalMode == 'update') {
      this.negociosService.detail(Number(this.negocio.id_negocio)).subscribe(
        (response) => {
          console.log(response);
          let negocio = response.data[0];
          this.photosNegocioArray = response.data[0].fotos_negocio;
          this.id_negocio = negocio.id_negocio;
          this.nombreNegocio?.setValue(negocio.nombre_negocio);
          this.direccion?.setValue(negocio.direccion);
          this.infoAdicionalDir?.setValue(
            negocio.informacion_adicional_direccion
          );
          this.latitud?.setValue(negocio.latitud);
          this.longitud?.setValue(negocio.longitud);
          this.descripcion?.setValue(negocio.descripcion_negocio);
          this.idDpto?.setValue(negocio.id_departamento);
          this.idMunic?.setValue(negocio.id_municipio);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  goBack() {
    this.platformLocation.back();
  }
  /* Funciones necesarias para el mapa y escoger direccion */
  idmunicipioselec() {
    if (this.modalMode == 'update') {
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              if (
                this.form.get('id_municipio')?.value !==
                Number(this.negocio.id_municipio)
              ) {
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
                this.direccion?.setValue('');
                this.verMapaDireccion();
                this.escogerdireccion = true;
                setTimeout(() => {
                  this.escogerdireccion = false;
                }, 30000);
                this.faltadireccion = true;
              } else {
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
                this.direccion?.setValue('');
                this.verMapaDireccion();
                this.escogerdireccion = true;
                setTimeout(() => {
                  this.escogerdireccion = false;
                }, 30000);
                this.faltadireccion = true;
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (this.modalMode == 'create') {
      this.faltanargumentos = false;
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              this.latitud?.setValue(response.data[0].latitud);
              this.longitud?.setValue(response.data[0].longitud);
              this.direccion?.setValue('');
              this.verMapaDireccion();
              this.faltadireccion = true;
              this.escogerdireccion = true;
              setTimeout(() => {
                this.escogerdireccion = false;
              }, 30000);
              this.mylatitudidmunicipio = response.data[0].latitud;
              this.mylongitudidmunicipio = response.data[0].longitud;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  verMapaDireccion() {
    this.faltadireccion = false;
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    if (this.modalMode == 'update') {
      if (
        this.form.getRawValue().latitud !== 0 &&
        this.form.getRawValue().longitud !== 0
      ) {
        this.modal = this.modalService.open(this.map, {
          size: 'xl',
          centered: true,
          windowClass: 'dark-modal',
        });
        this.modal.result
          .then((result) => {
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          })
          .catch((err) => {
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          });
        this.markerPosition = {
          lat: Number(this.form.get('latitud')?.value),
          lng: Number(this.form.get('longitud')?.value),
        };

        this.options = {
          center: {
            lat: Number(this.form.get('latitud')?.value),
            lng: Number(this.form.get('longitud')?.value),
          },
          restriction: {
            latLngBounds: sucreColombia,
            strictBounds: false,
          },
          zoom: 14,
          scrollwheel: true,
        };
      }
    } else if (this.modalMode == 'create') {
      if (
        this.form.getRawValue().latitud !== 0 &&
        this.form.getRawValue().longitud !== 0
      ) {
        this.faltanargumentos = false;
        this.modal = this.modalService.open(this.map, {
          size: 'xl',
          centered: true,
          windowClass: 'dark-modal',
        });
        this.modal.result
          .then((result) => {
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          })
          .catch((err) => {
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          });
        if (
          this.form.get('latitud')?.value == this.mylatitudidmunicipio &&
          this.form.get('longitud')?.value == this.mylongitudidmunicipio
        ) {
          this.markerPosition = {
            lat: Number(this.mylatitudidmunicipio),
            lng: Number(this.mylongitudidmunicipio),
          };

          this.options = {
            center: {
              lat: Number(this.mylatitudidmunicipio),
              lng: Number(this.mylongitudidmunicipio),
            },
            restriction: {
              latLngBounds: sucreColombia,
              strictBounds: false,
            },
            zoom: 14,
            scrollwheel: true,
          };
        } else {
          this.markerPosition = {
            lat: Number(this.form.get('latitud')?.value),
            lng: Number(this.form.get('longitud')?.value),
          };

          this.options = {
            center: {
              lat: Number(this.form.get('latitud')?.value),
              lng: Number(this.form.get('longitud')?.value),
            },
            restriction: {
              latLngBounds: sucreColombia,
              strictBounds: false,
            },
            zoom: 14,
            scrollwheel: true,
          };
        }
      } else {
        this.faltanargumentos = true;
      }
    }
    this.buscarx = '';
  }
  buscar() {
    this.loadingseart = true;
    const valor = this.buscarx;
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
        console.log(results);
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
                  this.markerPosition = {
                    lat: results[0].geometry.location.toJSON().lat!,
                    lng: results[0].geometry.location.toJSON().lng!,
                  };
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
  closeMap() {
    this.modal.close();
  }
  // Metodo para adicionar una marca en el mapa
  addMarker(event: google.maps.MapMouseEvent) {
    this.escogerdireccion = false;
    this.guarlatlog = false;
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
        index = this.municipios.findIndex(
          (element) => element.nombre == municipio
        );
        let idMunipio = this.municipios[index]?.id_municipio;
        if (dpto == 'Sucre') {
          this.fueraDirecion = false;
          this.markerPosition = {
            lat: event.latLng!.toJSON().lat,
            lng: event.latLng!.toJSON().lng,
          };
          if (this.modalMode == 'update') {
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
                  if (this.form.get('id_municipio')?.value == idMunipio) {
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    console.log(this.latitud);
                    console.log(this.longitud);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.faltadireccion = false;
                    this.closeMap();
                  } else {
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    console.log(this.latitud);
                    console.log(this.longitud);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.idMunic?.setValue(idMunipio);
                    this.closeMap();
                  }
                } else {
                  if (
                    this.form.get('latitud')?.value ==
                      this.mylatitudidmunicipio &&
                    this.form.get('longitud')?.value ==
                      this.mylongitudidmunicipio
                  ) {
                    this.markerPosition = {
                      lat: Number(this.mylatitudidmunicipio),
                      lng: Number(this.mylongitudidmunicipio),
                    };
                  } else {
                    this.markerPosition = {
                      lat: Number(this.form.get('latitud')?.value),
                      lng: Number(this.form.get('longitud')?.value),
                    };
                  }
                }
              })
              .catch((result) => {});
          } else if (this.modalMode == 'create') {
            this.confirmModalMapService
              .confirm(
                '../../../../assets/icons/iconoubicacion.svg',
                '../../../../assets/icons/save.svg',
                'Escoger ubicación',
                `Estás a punto de escoger la siguiente ubicación:`,
                'Si',
                'No estoy seguro',
                `${response.results[0].formatted_address}`
              )
              .then((result) => {
                if (result == true) {
                  if (this.form.get('id_municipio')?.value == idMunipio) {
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    console.log(this.latitud);
                    console.log(this.longitud);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.closeMap();
                  } else {
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    console.log(this.latitud);
                    console.log(this.longitud);
                    this.idMunic?.setValue(idMunipio);
                    this.closeMap();
                  }
                } else {
                  if (
                    this.form.get('latitud')?.value ==
                      this.mylatitudidmunicipio &&
                    this.form.get('longitud')?.value ==
                      this.mylongitudidmunicipio
                  ) {
                    this.markerPosition = {
                      lat: Number(this.mylatitudidmunicipio),
                      lng: Number(this.mylongitudidmunicipio),
                    };
                  } else {
                    this.markerPosition = {
                      lat: Number(this.form.get('latitud')?.value),
                      lng: Number(this.form.get('longitud')?.value),
                    };
                  }
                }
              })
              .catch((result) => {});
          }
        } else {
          this.noexistendatos = false;
          this.fueraDirecion = true;
          setTimeout(() => {
            this.fueraDirecion = false;
          }, 5000);
        }
      }
    });
  }
  /* funciones necesarias para cargar y adicionar fotos */
  @HostListener('loadPhotos')
  async loadPhotos(event: any) {
    if (this.modalMode == 'create') {
      /* Se ejecuta cuando se esta creando una granja */
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase =
          '/negocios/User' +
          Number(this.authUserId) +
          '/negocio' +
          Number(this.id_negocio) +
          '/foto';
        let files: Array<any> = compressedFiles;
        let arrayFotos: Array<any> = [];
        for (let i = 0; i < files.length; i++) {
          let nowTimestamp = new Date().getTime().toString();
          await this.storage
            .cloudStorageTask(fileNameBase + nowTimestamp, files[i])
            .percentageChanges()
            .toPromise();
          let downloadUrl = await this.storage
            .cloudStorageRef(fileNameBase + nowTimestamp)
            .getDownloadURL()
            .toPromise();
          arrayFotos.push(downloadUrl);
          console.log('Fotos guardadas');
        }
        this.photosNegocioArray = [];
        this.photosNegocioArray = this.photosNegocioArray.concat(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    } else if (this.modalMode == 'update') {
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase =
          '/negocios/User' +
          Number(this.authUserId) +
          '/negocio' +
          Number(this.negocio.id_negocio) +
          '/foto';
        let files: Array<any> = compressedFiles;
        console.log(files);
        let arrayFotos: Array<any> = [];
        for (let i = 0; i < files.length; i++) {
          let nowTimestamp = new Date().getTime().toString();
          await this.storage
            .cloudStorageTask(fileNameBase + nowTimestamp, files[i])
            .percentageChanges()
            .toPromise();
          let downloadUrl = await this.storage
            .cloudStorageRef(fileNameBase + nowTimestamp)
            .getDownloadURL()
            .toPromise();
          arrayFotos.push(downloadUrl);
          console.log('Fotos guardadas');
        }
        this.photosNegocioArray = this.photosNegocioArray.concat(arrayFotos);
        /* entrega las ultimas fotos que se cargaron, las manda al componente
        que las necesite */
        this.comunicacionEntreComponentesService.changeMyArray2(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    }
  }
  photosUpdate() {
    if (this.modalMode == 'update') {
      this.negociosService
        .updatePhotos(Number(this.id_negocio), this.photosNegocioArray)
        .subscribe(
          (response) => {
            console.log('fotos guardadas: ');
            console.log(response);
            this.loading1 = false;
          },
          (err) => {
            this.loading1 = false;
            console.log(err);
          }
        );
    } else if (this.modalMode == 'create') {
      /* Sube las fotos a la BD */
      this.negociosService
        .updatePhotos(Number(this.id_negocio), this.photosNegocioArray)
        .subscribe(
          (response) => {
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            this.loading1 = false;
            this.goBack();
            console.log(err);
          }
        );
    }
  }
  photosDelete(arraydelate: any[]) {
    console.log('nuevas fotos a actualizar despues de un delate');
    this.negociosService
      .updatePhotos(Number(this.id_negocio), arraydelate)
      .subscribe(
        (response) => {
          this.photosNegocioArray = arraydelate;
          console.log(response);
          console.log(this.photosNegocioArray);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  openPhotosModal() {
    this.platformLocation.onPopState(() => {
      this.appModalService.CloseModalGalleryVerAdiconarEliminarFotos();
    });
    let showconteslaider = false;
    let veryadicionar = true;
    let arrayFotos = this.photosNegocioArray;
    let filesCreate: any;
    if (this.modalMode == 'create') {
      filesCreate = this.filesfinalCreate;
    } else if (this.modalMode == 'update') {
      filesCreate = -1;
    }
    console.log(filesCreate);
    this.appModalService
      .modalGalleryVerAdiconarEliminarFoto(
        -1,
        -1,
        -1,
        showconteslaider,
        veryadicionar,
        arrayFotos,
        filesCreate,
        this.modalMode
      )
      .then((result: any) => {})
      .catch((result) => {});
  }
  get idDpto() {
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get nombreNegocio() {
    return this.form.get('nombre_negocio');
  }

  get descripcion() {
    return this.form.get('descripcion_negocio');
  }

  get direccion() {
    return this.form.get('direccion');
  }

  get infoAdicionalDir() {
    return this.form.get('informacion_adicional_direccion');
  }
  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }
}
