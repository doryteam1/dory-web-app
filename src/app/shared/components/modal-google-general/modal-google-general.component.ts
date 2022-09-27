import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap, MapGeocoder, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { PlatformLocation } from '@angular/common';
import { environment } from 'src/environments/environment';
import { PlacesService } from 'src/app/services/places.service';
import { ConfirmModalMapService } from '../../services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
import { ComunicacionEntreComponentesService } from '../../services/comunicacion-entre-componentes.service';
import { limiteMapa } from 'src/models/limiteMapaGoogle.model';


@Component({
  selector: 'app-modal-google-general',
  templateUrl: './modal-google-general.component.html',
  styleUrls: ['./modal-google-general.component.scss'],
})
export class ModalGoogleGeneralComponent implements OnInit {
  @Input() atributos: any = {};
  @Input() modalheader!: boolean;
  @Input() iconMarkerGoogleMap!: string;
  @Input() mapaSeach: boolean = false;
  @Input() limiteMapa: limiteMapa = {
    limite: 'Sucre',
    nivDivAdm: 'Departamento',
    id_departamento: 70,
  };
  @Input() shared: boolean = false;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('marker') marker!: MapMarker;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  mapaOn: boolean = false;
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng: -75.188469 },
    zoom: 10,
    scrollwheel: true,
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 9.214145,
    lng: -75.188469,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  apiLoaded!: Observable<boolean>;
  indexSelected: number = -1;
  /* nuevas varibles */
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  noexistendatos: boolean = false;
  guarlatlog: boolean = false;
  escogerdireccion: boolean = false;
  valorbuscarx: string = '';
  faltadireccion: boolean = false;
  modal!: NgbModalRef;
  departamentos: Array<any> = [];
  municipios: Array<any> = [];
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };
  vertices = vertices;
  constructor(
    httpClient: HttpClient,
    private _modalService: NgbActiveModal,
    private appModalService: AppModalService,
    public location: PlatformLocation,
    /* nuevas varibles */
    private places: PlacesService,
    private geocoder: MapGeocoder,
    private confirmModalMapService: ConfirmModalMapService,
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
  ngOnInit(): void {
    if (this.mapaSeach) {
      this.iniciarMapaSearch();
      this.loadDptos();
    } else {
      this.iniciarMapaGeneral();
    }
  }

  iniciarMapaGeneral() {
    /* https://www.arcgis.com/apps/Viewer/index.html?appid=a294eaa759194c259ee22dc45b6fcc75 */
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    this.options = {
      center: {
        lat: parseFloat(this.atributos.longAndLat.lat),
        lng: parseFloat(this.atributos.longAndLat.lng),
      },
      zoom: 13,
      scrollwheel: true,
      restriction: {
        latLngBounds: sucreColombia,
        strictBounds: false,
      },
      streetViewControl: false,
      fullscreenControl: false,
    };
    this.markerPosition = {
      lat: parseFloat(this.atributos.longAndLat.lat),
      lng: parseFloat(this.atributos.longAndLat.lng),
    };
  }
  mapainiciado() {
    /* https://www.freakyjolly.com/angular-google-maps-integration-with-markers-info-windows-tutorial/ */
    this.openInfoWindow(this.marker);
    this.mapaOn = true;
  }
  public decline() {
    this._modalService.close(false);
  }
  public accept() {
    this._modalService.close(true);
  }
  public dismiss() {
    this._modalService.dismiss();
  }
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
  eliminInfoWindow() {
    this.infoWindow.close();
  }
  share() {
    if (this.shared) {
      this.location.onPopState(() => {
        this.appModalService.closeModalShare();
      });
      this.appModalService
        .shared(
          `${this.atributos.nombreAtributo.dato1}`,
          true,
          `https://www.google.com/maps?q=${this.atributos.longAndLat.lat},${this.atributos.longAndLat.lng}`,
          ``
        )
        .then((result) => {})
        .catch((result) => {});
    }
  }
  /* Funciones Mapa seach */
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
    if (this.limiteMapa.id_departamento !== 'Todos') {
      this.places
        .getMunicipiosDepartamentos(this.limiteMapa.id_departamento)
        .subscribe(
          (response) => {
            this.municipios = response.data;
          },
          (err) => {
            console.log(err);
          }
        );
      return;
    }
    if (this.limiteMapa.id_departamento == 'Todos') {
      this.places.getMunicipiosTodos().subscribe(
        (response) => {
          this.municipios = response.data;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  iniciarMapaSearch() {
    if (this.limiteMapa.id_departamento !== 'Todos') {
      /* Solo sucre */
      const sucreColombia = {
        north: 10.184454,
        south: 8.136442,
        west: -75.842392,
        east: -74.324908,
      };
      this.markerPosition = {
        lat: parseFloat(this.atributos.longAndLat.lat),
        lng: parseFloat(this.atributos.longAndLat.lng),
      };

      this.options = {
        center: {
          lat: parseFloat(this.atributos.longAndLat.lat),
          lng: parseFloat(this.atributos.longAndLat.lng),
        },
        restriction: {
          latLngBounds: sucreColombia,
          strictBounds: false,
        },
        zoom: 14,
        scrollwheel: true,
      };
    } else if (this.limiteMapa.id_departamento == 'Todos') {
      /* Todo colombia */
      const Colombia = {
        north: 12.655134,
        south: -4.243646,
        west: -79.359935,
        east: -67.099192,
      };
      this.markerPosition = {
        lat: parseFloat(this.atributos.longAndLat.lat),
        lng: parseFloat(this.atributos.longAndLat.lng),
      };

      this.options = {
        center: {
          lat: parseFloat(this.atributos.longAndLat.lat),
          lng: parseFloat(this.atributos.longAndLat.lng),
        },
        restriction: {
          latLngBounds: Colombia,
          strictBounds: false,
        },
        zoom: 14,
        scrollwheel: true,
      };
    }
  }

  closeMap() {
    this._modalService.dismiss();
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
              let limites: any[] = [
                {
                  Pais: [],
                  Departamento: [],
                  Municipio: [],
                },
              ];
              for (let index = 0; index < response.results.length; index++) {
                /* Paises */
                const pais = response.results[index].address_components;
                let indexPais = pais.findIndex((element) =>
                  element.types.includes('country')
                );
                if (pais[indexPais]?.long_name !== undefined) {
                  limites[0].Pais.push(pais[indexPais]?.long_name);
                }
                /* Departamentos */
                const departamento = response.results[index].address_components;
                let indexDpto = departamento.findIndex((element) =>
                  element.types.includes('administrative_area_level_1')
                );
                if (departamento[indexDpto]?.long_name !== undefined) {
                  limites[0].Departamento.push(
                    departamento[indexDpto]?.long_name
                  );
                }
                /* Municipios */
                const municipio = response.results[index].address_components;
                let indexMunic = departamento.findIndex((element) =>
                  element.types.includes('administrative_area_level_2')
                );
                if (municipio[indexMunic]?.long_name !== undefined) {
                  limites[0].Municipio.push(municipio[indexMunic]?.long_name);
                }
              }
              /* Elinar datos duplicados */
              limites[0].Pais = limites[0].Pais.filter(
                (item: any, index: any) => {
                  return limites[0].Pais.indexOf(item) === index;
                }
              );
              limites[0].Departamento = limites[0].Departamento.filter(
                (item: any, index: any) => {
                  return limites[0].Departamento.indexOf(item) === index;
                }
              );
              limites[0].Municipio = limites[0].Municipio.filter(
                (item: any, index: any) => {
                  return limites[0].Municipio.indexOf(item) === index;
                }
              );
              /* Asignacion de ids */
              let indDpto = this.departamentos.findIndex((dpto) => {
                let valor;
                for (
                  let index = 0;
                  index < limites[0].Departamento.length;
                  index++
                ) {
                  valor =
                    limites[0].Departamento[index] == dpto.nombre_departamento;
                }
                return valor;
              });

              let idMunicipio = this.municipios.findIndex((munic) => {
                let valor;
                for (
                  let index = 0;
                  index < limites[0].Municipio.length;
                  index++
                ) {
                  valor = limites[0].Municipio[index] == munic.nombre;
                }
                return valor;
              });
              let idDepartamento = this.departamentos[indDpto]?.id_departamento;
              let idMunipio = this.municipios[idMunicipio]?.id_municipio;
              /* Limitaciones */
              if (
                limites[0][this.limiteMapa.nivDivAdm].includes(
                  this.limiteMapa.limite
                )
              ) {
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
  @HostListener('openAddMarker')
  addMarker(event: google.maps.MapMouseEvent) {
    this.escogerdireccion = false;
    this.guarlatlog = false;
    const point: google.maps.LatLngLiteral = {
      lat: event.latLng?.toJSON().lat!,
      lng: event.latLng?.toJSON().lng!,
    };
    this.places.geocodeLatLng(point).then((response) => {
      if (response.status == 'OK') {
        let limites: any[] = [
          {
            Pais: [],
            Departamento: [],
            Municipio: [],
          },
        ];
        for (let index = 0; index < response.results.length; index++) {
          /* Paises */
          const pais = response.results[index].address_components;
          let indexPais = pais.findIndex((element) =>
            element.types.includes('country')
          );
          if (pais[indexPais]?.long_name !== undefined) {
            limites[0].Pais.push(pais[indexPais]?.long_name);
          }
          /* Departamentos */
          const departamento = response.results[index].address_components;
          let indexDpto = departamento.findIndex((element) =>
            element.types.includes('administrative_area_level_1')
          );
          if (departamento[indexDpto]?.long_name !== undefined) {
            limites[0].Departamento.push(departamento[indexDpto]?.long_name);
          }
          /* Municipios */
          const municipio = response.results[index].address_components;
          let indexMunic = departamento.findIndex((element) =>
            element.types.includes('administrative_area_level_2')
          );
          if (municipio[indexMunic]?.long_name !== undefined) {
            limites[0].Municipio.push(municipio[indexMunic]?.long_name);
          }
        }
        /* Elinar datos duplicados */
        limites[0].Pais = limites[0].Pais.filter((item: any, index: any) => {
          return limites[0].Pais.indexOf(item) === index;
        });
        limites[0].Departamento = limites[0].Departamento.filter(
          (item: any, index: any) => {
            return limites[0].Departamento.indexOf(item) === index;
          }
        );
        limites[0].Municipio = limites[0].Municipio.filter(
          (item: any, index: any) => {
            return limites[0].Municipio.indexOf(item) === index;
          }
        );
        /* Asignacion de ids */
        let indDpto = this.departamentos.findIndex((dpto) => {
          let valor;
          for (let index = 0; index < limites[0].Departamento.length; index++) {
            valor = limites[0].Departamento[index] == dpto.nombre_departamento;
          }
          return valor;
        });

        let idMunicipio = this.municipios.findIndex((munic) => {
          let valor;
          for (let index = 0; index < limites[0].Municipio.length; index++) {
            valor = limites[0].Municipio[index] == munic.nombre;
          }
          return valor;
        });
        let idDepartamento = this.departamentos[indDpto]?.id_departamento;
        let idMunipio = this.municipios[idMunicipio]?.id_municipio;
        /* Limitaciones */
        if (
          limites[0][this.limiteMapa.nivDivAdm].includes(this.limiteMapa.limite)
        ) {
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
                let datos: any = [
                  {
                    latitud: event.latLng!.toJSON().lat,
                    longitud: event.latLng!.toJSON().lng,
                    id_municipio: idMunipio,
                    direccion: response.results[0].formatted_address,
                    id_departamento: idDepartamento,
                  },
                ];
                this.atributos.longAndLat.lat = event.latLng!.toJSON().lat;
                this.atributos.longAndLat.lng = event.latLng!.toJSON().lng;
                this.comunicacionEntreComponentesService.changeMyArray(datos);
              } else {
                this.markerPosition = {
                  lat: parseFloat(this.atributos.longAndLat.lat),
                  lng: parseFloat(this.atributos.longAndLat.lng),
                };
              }
            })
            .catch((result) => {
              this.markerPosition = {
                lat: parseFloat(this.atributos.longAndLat.lat),
                lng: parseFloat(this.atributos.longAndLat.lng),
              };
            });
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
}
