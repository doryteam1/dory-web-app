import { Component, OnInit ,  ElementRef,
  ViewChild,
 } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { SafeUrl} from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
import { NegociosService } from 'src/app/services/negocios.service';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
const _ = require('lodash');

@Component({
  selector: 'app-mis-negocios',
  templateUrl: './mis-negocios.component.html',
  styleUrls: ['./mis-negocios.component.scss'],
})
export class MisNegociosComponent implements OnInit {
  @ViewChild('myselecmunicipio') myselecmunicipio!: ElementRef;
  @ViewChild('map') map: any;
  negocios: Array<any> = [];
  showNotFound: boolean = false;
  indicenegocio!: number;
  guarlatlog: boolean = false;
  noexistendatos: boolean = false;
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  valorbuscarx: string = '';
  p!: number;
  tempDir: string = '';
  tempMunicId: number = -1;
  firstTimeOpenModal = true;
  form: FormGroup = new FormGroup({
    nombre_negocio: new FormControl(''),
    direccion: new FormControl('', [Validators.required]),
    informacion_adicional_direccion: new FormControl(''),
    latitud: new FormControl(0),
    longitud: new FormControl(0),
    descripcion_negocio: new FormControl(''),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
  });
  file: any = null;
  productImagePath: string = '';
  itemUpdateIndex: number = -1;
  modalMode: string = 'create';
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  apiLoaded: Observable<boolean>;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  authUserId: number = -1;
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
  photosNegocioArrayCopy: Array<string> = [];
  photosNegocioUrlToDel: Array<string> = [];
  isPhotoSelectingToDel: boolean = false;
  indexSelectedToDel: Array<number> = [];
  showNotFoundPhotos: boolean = false;
  timeLapsed1: number = 0;
  municipiocambiado: boolean = false;
  mylatitudidmunicipio!: number;
  mylongitudidmunicipio!: number;
  isOpenMap: boolean = false;
  escogerdireccion: boolean = false;
  faltadireccion: boolean = false;
  faltanargumentos: boolean = false;
  modal!: NgbModalRef;
  negocio: any;
  photosNegocioArray: Array<string | SafeUrl> = [];
  constructor(
    private negociosService: NegociosService,
    private modalService: NgbModal,
    private places: PlacesService,
    private appModalService: AppModalService,
    httpClient: HttpClient,
    private geocoder: MapGeocoder,
    private confirmModalMapService: ConfirmModalMapService,
    public platformLocation: PlatformLocation,
    private router: Router
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
  ngOnInit(): void {
    this.AutoNgOnInit();
  }
  AutoNgOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    console.log(this.authUserId);
    this.negociosService.getNegociosByUserId(payload.sub).subscribe(
      (respose) => {
        this.negocios = respose.data;
        console.log(this.negocios);
        if (this.negocios.length < 1 || this.negocios.length == 0) {
          this.showNotFound = true;
        }
      },
      (err) => {
        if (err.status == 404) {
          this.showNotFound = true;
        }
      }
    );
  this.loadDptos();
  }

  deleteNegocio(negocio: any) {
    this.appModalService
      .confirm(
        'Eliminar negocio',
        'Esta seguro que desea eliminar este negocio',
        'Eliminar',
        'Cancelar',
        negocio.nombre
      )
      .then((result) => {
        if (result == true) {
          this.negociosService.deleteNegocio(negocio.id_negocio).subscribe(
            (response: any) => {
              let index = this.negocios.findIndex(
                (element) => element.id_negocio == negocio.id_negocio
              );
              this.negocios.splice(index, 1);
              if (this.negocios.length <= 0) {
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }
  loadDptos() {
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.departamentos = response.data;
        this.loadMunic();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadMunic() {
    this.places.getMunicipiosDepartamentos(70).subscribe(
      (response) => {
        this.municipios = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  verMap(idNegocio?: number) {
    this.faltadireccion = false;
    let index = this.negocios.findIndex(
      (negocio) => negocio.id_negocio == idNegocio /* negocio.id_negocio */
    );
    this.indicenegocio = index;
    this.modalMode = 'updateporvermapa';
    this.modal = this.modalService.open(this.map, {
      size: 'xl',
      centered: true,
      windowClass: 'dark-modal',
    });
    this.modal.result
      .then((result) => {
        console.log('se cerro modal ', result);
      })
      .catch((err) => {
        console.log(err);
      });
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    this.markerPosition = {
      lat: parseFloat(this.negocios[index!].latitud),
      lng: parseFloat(this.negocios[index!].longitud),
    };

    this.options = {
      center: {
        lat: parseFloat(this.negocios[index!].latitud),
        lng: parseFloat(this.negocios[index!].longitud),
      },
      restriction: {
        latLngBounds: sucreColombia,
        strictBounds: false,
      },
      zoom: 14,
      scrollwheel: true,
    };
    this.buscarx = '';
  }
  closeMap() {
    this.modal.close();
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
        console.log(municipio)
        index = this.municipios.findIndex(
          (element) =>element.nombre == municipio
          );
        let idMunipio = this.municipios[index]?.id_municipio;
         let municipioNombre = this.municipios[index]?.nombre;
        if (dpto == 'Sucre') {
          this.markerPosition = point;
          this.fueraDirecion = false;
          if (this.modalMode == 'updateporvermapa') {
            this.confirmModalMapService
              .confirm(
                '../../../../assets/icons/editar.svg',
                '../../../../assets/icons/save.svg',
                'Actualizar ubicación',
                'Estás a punto de cambiar tu ubicación por: ',
                'Si',
                'No estoy seguro',
                `${response.results[0].formatted_address}`
              )
              .then((result) => {
                if (result == true) {
                  this.negociosService
                    .updateParcialNegocio(
                      this.negocios[this.indicenegocio!].id_negocio,
                      {
                        latitud: event.latLng!.toJSON().lat,
                        longitud: event.latLng!.toJSON().lng,
                        id_municipio: idMunipio,
                        direccion: response.results[0].formatted_address,
                       /*  nombre_municipio:municipioNombre */
                      }
                    )
                    .subscribe(
                      (response) => {
                        console.log(response);
                        this.AutoNgOnInit();
                      },
                      (err) => {
                        this.guarlatlog = true;
                        setTimeout(() => {
                          this.guarlatlog = false;
                        }, 5000);
                        console.log(err);
                      }
                    );
                } else {
                  this.markerPosition = {
                    lat: parseFloat(this.negocios[this.indicenegocio!].latitud),
                    lng: parseFloat(
                      this.negocios[this.indicenegocio!].longitud
                    ),
                  };
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
  createNewNegocio() {
    let object = {
      action: 'create',
      formState: 'enable',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/negocio/detalle', object]);
  }
  editarNegocio(negocio: any) {
    let object: any = { ...negocio };
    (object.action = 'update'), (object.authUserId = this.authUserId);
    this.router.navigate(['/dashboard/negocio/detalle', object]);
  }
}
