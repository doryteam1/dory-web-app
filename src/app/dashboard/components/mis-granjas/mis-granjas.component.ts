import { Component, OnInit ,  ElementRef,
  ViewChild,
  HostListener,
 } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import {  NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
import { Router } from '@angular/router';
const _ = require('lodash');

@Component({
  selector: 'app-mis-granjas',
  templateUrl: './mis-granjas.component.html',
  styleUrls: ['./mis-granjas.component.scss'],
})
export class MisGranjasComponent implements OnInit {
  @ViewChild('map') map: any;
  granjas: Array<any> = [];
  showNotFound: boolean = false;
  indicegranja!: number;
  guarlatlog: boolean = false;
  noexistendatos: boolean = false;
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  valorbuscarx: string = '';
  mylatitudidmunicipio!: number;
  mylongitudidmunicipio!: number;
  faltanargumentos: boolean = false;
  faltadireccion: boolean = false;
  modal!: NgbModalRef;
  p!: number;
  file: any = null;
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
  disableinput = false;
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
  timeLapsed1: number = 0;
  escogerdireccion: boolean = false;
  constructor(
    private granjaService: GranjasService,
    private modalService: NgbModal,
    private places: PlacesService,
    private appModalService: AppModalService,
    httpClient: HttpClient,
    private geocoder: MapGeocoder,
    private router: Router,
    private confirmModalMapService: ConfirmModalMapService,
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
    this.autorecarga();
  }
  autorecarga(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.granjaService.getGranjaByUserId(payload.sub).subscribe(
      (respose) => {
        this.granjas = respose.data;
        if (this.granjas.length < 1 || this.granjas.length == 0) {
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

  deleteGranja(idGranja: number) {
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
    this.appModalService
      .confirm(
        'Eliminar granja',
        'Esta seguro que desea eliminar la granja',
        'Eliminar',
        'No estoy seguro',
        this.granjas[index].nombre
      )
      .then((result) => {
        if (result == true) {
          this.granjaService.deleteGranja(idGranja).subscribe(
            (response: any) => {
              this.granjas.splice(index, 1);
              if (this.granjas.length <= 0) {
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

  verMap(idGranja?: number) {
    this.faltadireccion = false;
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
    this.modalMode = 'updateporvermapa';
    this.indicegranja = index!;
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
      lat: parseFloat(this.granjas[index!].latitud),
      lng: parseFloat(this.granjas[index!].longitud),
    };

    this.options = {
      center: {
        lat: parseFloat(this.granjas[index!].latitud),
        lng: parseFloat(this.granjas[index!].longitud),
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
          if (this.modalMode == 'updateporvermapa') {
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
                  this.granjaService
                    .updateParcial(this.granjas[this.indicegranja!].id_granja, {
                      latitud: event.latLng!.toJSON().lat,
                      longitud: event.latLng!.toJSON().lng,
                      id_municipio: idMunipio,
                      direccion: response.results[0].formatted_address,
                    })
                    .subscribe(
                      (response) => {
                        this.autorecarga();
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
                    lat: parseFloat(this.granjas[this.indicegranja!].latitud),
                    lng: parseFloat(this.granjas[this.indicegranja!].longitud),
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

  createNewGranja() {
    let object = {
      action: 'create',
      formState: 'enable',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/granja/detalle', object]);
  }
  editarGranja(granja: any, formState: string) {
    let object: any = { ...granja };
    (object.action = 'update'),
      (object.formState = formState),
      (object.authUserId = this.authUserId);
      this.router.navigate(['/dashboard/granja/detalle', object]);
  }

}
