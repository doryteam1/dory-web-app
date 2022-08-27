
import { Component, OnInit,
  ViewChild,
  HostListener,
  OnDestroy} from '@angular/core';
  import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import {Location, PlatformLocation } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import {  NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
import { SafeUrl } from '@angular/platform-browser';
import { ComunicacionEntreComponentesService } from '../../../shared/services/comunicacion-entre-componentes.service';

const _ = require('lodash');
@Component({
  selector: 'app-granja-detalle-form',
  templateUrl: './granja-detalle-form.component.html',
  styleUrls: ['./granja-detalle-form.component.scss'],
})
export class GranjaDetalleFormComponent implements OnInit, OnDestroy {
  @ViewChild('map') map: any;
  formState = 'enable';
  modalMode: string = 'update';
  granja: any;
  file: any = null;
  /* error: string = ''; */
  action!: string;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  photosGranjaArray: Array<string | SafeUrl> = [];
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  filesfinalCreate: any[] = [];
  loading1: boolean = false;
  loadingphoto: boolean = false;
  cargandodata: boolean = false;
  authUserId: number = -1;
  id_granjanew: any;
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
  /* form declaraciones*/
  form: FormGroup = new FormGroup({
    nombre_granja: new FormControl('', [Validators.required]),
    area: new FormControl(0, [Validators.required]),
    numero_trabajadores: new FormControl(0, [Validators.required]),
    produccion_estimada_mes: new FormControl(0, [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    informacion_adicional_direccion: new FormControl('', [Validators.required]),
    latitud: new FormControl(0, [Validators.required]),
    longitud: new FormControl(0, [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl(0, [Validators.required]),
    id_vereda: new FormControl(0),
    id_corregimiento: new FormControl(0),
    corregimiento_vereda: new FormControl(''),
    arrayTiposInfraestructuras: new FormArray([]),
    arrayEspecies: new FormArray([]),
  });
  constructor(
    private granjaService: GranjasService,
    private modalService: NgbModal,
    httpClient: HttpClient,
    private geocoder: MapGeocoder,
    private confirmModalMapService: ConfirmModalMapService,
    private storage: FirebaseStorageService,
    private places: PlacesService,
    private ar: ActivatedRoute,
    private location: Location,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService
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
    this.direccion?.disable();
    registerLocaleData(es);
    this.granja = this.ar.snapshot.params;
    /*  console.log(this.granja); */
    let action = this.ar.snapshot.paramMap.get('action');
    this.formState = this.ar.snapshot.paramMap.get('formState')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    this.prepareForm(action!, this.granja);
    this.loadDptos();
    this.granjaService.getInfraestructuras().subscribe(
      (response) => {
        this.infraestructurasData = response.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this.granjaService.getEspecies().subscribe(
      (response) => {
        this.especiesData = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
    if (action == 'update') {
      this.granjaService
        .getGranjaDetalle(this.granja.id_granja)
        .subscribe((response) => {
          this.photosGranjaArray = response.data[0].fotos;
        });
    }
    /* escucha el componente que carga los files desde la modal */
    this.changeArray =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (arrayFiles) => {
          if (arrayFiles.length > 0) {
            if (action == 'create') {
              console.log('files ngOnlnit create');
              /*          console.log(arrayFiles); */
              if (arrayFiles[0].length > 0) {
                for (let index = 0; index < arrayFiles[0].length; index++) {
                  const element = arrayFiles[0][index];
                  this.photosGranjaArray = arrayFiles[0];
                  console.log(this.photosGranjaArray);
                }
              } else {
                this.photosGranjaArray = [];
              }
              for (let index = 0; index < arrayFiles[1].length; index++) {
                const element = arrayFiles[1][index];
                this.filesfinalCreate.push(element);
              }
              for (let index = 0; index < arrayFiles[2].length; index++) {
                const element = arrayFiles[2][index];
                this.filesfinalCreate.splice(element, 1);
              }
              console.log(this.photosGranjaArray);
              console.log(this.filesfinalCreate);
            } else if (action == 'update') {
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
  addGranja() {
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
      this.granjaService.addGranja(this.form.getRawValue()).subscribe(
        (response) => {
          this.id_granjanew = response.body.insertId;
          if (this.filesfinalCreate.length !== 0) {
            this.loadPhotos(this.filesfinalCreate);
            this.loadingphoto = true;
          } else {
            this.loading1 = false;
            this.goBack();
          }
        },
        (err) => {
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

  updateGranja() {
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
      this.granjaService
        .updateGranja(this.granja.id_granja, this.form.getRawValue())
        .subscribe(
          (response) => {
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
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

  onCheckboxChange(e: any, controlName: string) {
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach(
        (
          item: AbstractControl,
          i: number,
          controls: Array<AbstractControl>
        ) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            return;
          }
          i++;
        }
      );
    }
  }

  isChecked(controlName: string, value: number) {
    let checked: boolean = false;
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    checkArray.controls.forEach(
      (item: AbstractControl, i: number, controls: Array<AbstractControl>) => {
        if (item.value == value) {
          checked = true;
        }
      }
    );
    return checked;
  }

  initForm() {
    this.idmunicipioselec();
    this.nombreGranja?.setValue('');
    this.area?.setValue(0);
    this.numeroTrabajadores?.setValue(0);
    this.prodEstimadaMes?.setValue(0);
    this.direccion?.setValue('');
    this.informacionAdicionalDireccion?.setValue('');
    this.latitud?.setValue(0);
    this.longitud?.setValue(0);
    this.descripcion?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
    this.idVereda?.setValue(0);
    this.idCorregimiento?.setValue(0);
    this.corregimiento_vereda?.setValue('');
    this.infraestructuras.clear();
    this.especies.clear();
  }

  prepareForm(action: string, granja?: any) {
    this.faltanargumentos = false;
    this.faltadireccion = false;
    this.modalMode = action;
    this.form.reset();
    this.initForm();
    this.idDpto?.setValue(70);
    if (action == 'update') {
      this.granjaService
        .getGranjaDetalle(this.granja.id_granja)
        .subscribe((granja) => {
          let granjaDetalle = granja.data[0];
          this.nombreGranja?.setValue(granjaDetalle.nombre);
          this.area?.setValue(granjaDetalle.area);
          this.numeroTrabajadores?.setValue(granjaDetalle.numero_trabajadores);
          this.prodEstimadaMes?.setValue(granjaDetalle.produccion_estimada_mes);
          this.direccion?.setValue(granjaDetalle.direccion);
          this.informacionAdicionalDireccion?.setValue(
            granjaDetalle.informacion_adicional_direccion
          );
          this.latitud?.setValue(granjaDetalle.latitud);
          this.longitud?.setValue(granjaDetalle.longitud);
          this.descripcion?.setValue(granjaDetalle.descripcion);
          this.idDpto?.setValue(granjaDetalle.id_departamento);
          this.idMunic?.setValue(granjaDetalle.id_municipio);
          this.idVereda?.setValue(granjaDetalle.id_vereda);
          this.idCorregimiento?.setValue(granjaDetalle.id_corregimiento);
          this.corregimiento_vereda?.setValue(
            granjaDetalle.corregimiento_vereda
          );
          if (
            granjaDetalle.infraestructuras &&
            granjaDetalle.infraestructuras.length > 0
          ) {
            granjaDetalle.infraestructuras.forEach((element: any) => {
              this.infraestructuras?.push(
                new FormControl(element.id_infraestructura)
              );
            });
          }

          if (granjaDetalle.especies && granjaDetalle.especies.length > 0) {
            granjaDetalle.especies.forEach((element: any) => {
              this.especies?.push(new FormControl(element.id_especie));
            });
          }
        });
      if (this.formState == 'disable') {
        this.form.disable();
      }
    }
    /*   console.log('granjas cargada en form ', this.form.getRawValue()); */
  }
  goBack() {
    this.location.back();
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
                this.granja.id_municipio
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
                /*  this.latitud?.setValue(this.granja.latitud);
                this.longitud?.setValue(this.granja.longitud);
                this.direccion?.setValue(this.granja.direccion);
                this.faltadireccion = false; */
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
        console.log('response total');
        console.log(response);
        console.log('mis municipios');
        console.log(this.municipios);
        console.log('resul');
        let result = response.results[0].address_components;
        console.log(result);
        /*departamento  */
        console.log('identificar el departamento');
        console.log('administrative_area_level_1');
        let index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_1')
        );
        console.log(`departamento index ${index}`);
        let dpto = result[index].short_name;
        console.log(`departamento ${dpto}`);
        /* munisipio */
        console.log('identificar el municipio');
        console.log('administrative_area_level_2');
        index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_2')
        );
        console.log(`municipio index ${index}`);
        let municipio = result[index].short_name;
        console.log(`municipio ${municipio}`);
        /* compribar a ver si existe enla lista */
        index = this.municipios.findIndex(
          (element) => element.nombre == municipio
        );
        console.log(`municipio index id ${index}`);
        let idMunipio = this.municipios[index]?.id_municipio;

        console.log(`municipio id  mi lista ${idMunipio}`);

        if (dpto == 'Sucre') {
          this.fueraDirecion = false;
          this.markerPosition = {
            lat: event.latLng!.toJSON().lat,
            lng: event.latLng!.toJSON().lng,
          };
          /* console.log(this.granjas[this.indicegranja!]); */
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
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.faltadireccion = false;
                    this.closeMap();
                  } else {
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
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
                    console.log('igual');
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.closeMap();
                  } else {
                    console.log('difrente');
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
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
    if (this.granja.action == 'create') {
      /* Se ejecuta cuando se esta creando una granja */
      try {
        let fileNameBase =
          '/granjas/User' +
          this.authUserId +
          '/granja' +
          this.id_granjanew +
          '/foto';
        console.log(fileNameBase);
        let files: Array<any> = event;
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
        }
        this.photosGranjaArray = [];
        this.photosGranjaArray = this.photosGranjaArray.concat(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    } else if (this.granja.action == 'update') {
      /* Se ejecuta cuando se esta editando una granja */
      try {
        let fileNameBase =
          '/granjas/User' +
          this.authUserId +
          '/granja' +
          this.granja.id_granja +
          '/foto';
        console.log(fileNameBase);
        let files: Array<any> = event;
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
        }
        console.log('Fotos granjas guardadas en firebase');
        this.photosGranjaArray = this.photosGranjaArray.concat(arrayFotos);
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
    if (this.granja.action == 'update') {
      this.granjaService
        .updatePhotos(this.granja.id_granja, {
          arrayFotos: this.photosGranjaArray,
        })
        .subscribe(
          (response) => {
            console.log('fotos guardadas: ');
            console.log(response);
            this.loading1 = false;
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (this.granja.action == 'create') {
      /* Sube las fotos a la BD */
      this.granjaService
        .updatePhotos(this.id_granjanew, {
          arrayFotos: this.photosGranjaArray,
        })
        .subscribe(
          (response) => {
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  photosDelete(arraydelate: any[]) {
    console.log('nuevas fotos a actualizar despues de un delate');
    this.granjaService
      .updatePhotos(this.granja.id_granja, {
        arrayFotos: arraydelate,
      })
      .subscribe(
        (response) => {
          this.photosGranjaArray = arraydelate;
          console.log(response);
          console.log(this.photosGranjaArray);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  openPhotosModalCreate() {
    this.platformLocation.onPopState(() => {
      this.modalService.dismissAll();
    });

    let showconteslaider = false;
    let veryadicionar = true;
    let arrayFotos = this.photosGranjaArray;
    let filesCreate = this.filesfinalCreate;
    let action = 'create';
    this.appModalService
      .modalGalleryVerAdiconarEliminarFoto(
        -1,
        -1,
        -1,
        showconteslaider,
        veryadicionar,
        arrayFotos,
        filesCreate,
        action
      )
      .then((result: any) => {
      })
      .catch((result) => {});
  }
  openPhotosModalUpdate() {
    this.platformLocation.onPopState(() => {
      this.modalService.dismissAll();
    });
    let showconteslaider = false;
    let veryadicionar = true;
    let action = 'update';
    let arrayFotos = this.photosGranjaArray;
    this.appModalService
      .modalGalleryVerAdiconarEliminarFoto(
        -1,
        -1,
        -1,
        showconteslaider,
        veryadicionar,
        arrayFotos,
        -1,
        action
      )
      .then((result: any) => {

      })
      .catch((result) => {});
  }
  get idDpto() {
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get nombreGranja() {
    return this.form.get('nombre_granja');
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get area() {
    return this.form.get('area');
  }

  get numeroTrabajadores() {
    return this.form.get('numero_trabajadores');
  }

  get prodEstimadaMes() {
    return this.form.get('produccion_estimada_mes');
  }

  get direccion() {
    return this.form.get('direccion');
  }

  get corregimiento_vereda() {
    return this.form.get('corregimiento_vereda');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get idVereda() {
    return this.form.get('id_vereda');
  }

  get idCorregimiento() {
    return this.form.get('id_corregimiento');
  }

  get infraestructuras() {
    return this.form.get('arrayTiposInfraestructuras') as FormArray;
  }

  get especies() {
    return this.form.get('arrayEspecies') as FormArray;
  }
  get informacionAdicionalDireccion() {
    return this.form.get('informacion_adicional_direccion');
  }
}

