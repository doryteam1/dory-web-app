import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Granja } from 'src/models/granja.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GranjasService } from '../../services/granjas.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Location,
  PlatformLocation,
  registerLocaleData,

} from '@angular/common';
import es from '@angular/common/locales/es';
import { environment } from 'src/environments/environment';
import { PlacesService } from 'src/app/services/places.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { vertices } from '../../../global/constants';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from '../../../../models/buscarPor.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-granjas-municipio',
  templateUrl: './granjas-municipio.component.html',
  styleUrls: ['./granjas-municipio.component.scss'],
})
export class GranjasMunicipioComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('marker') marker!: MapMarker;
  showNotFound: boolean = false;
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  indexSelected: number = -1;
  granjaDetailRoute: string = '';
  poblacion: number = 0;
  municipio: string = '';
  activaapiLoader: boolean = true;
  mapaOn: boolean = false;
  apiLoaded!: Observable<boolean>;
  valor: boolean = false;
  vertices = vertices;
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng: -75.188469 },
    zoom: 10,
    scrollwheel: true,
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 9.214145,
    lng: -75.188469,
  };
  selectedGranja = {
    nombregranja: '',
    dirreciongranja: '',
    area: 0,
    propietario: {
      nombre: '',
    },
  };
  displayblock: boolean = false;
  granjas: any[] = [];
  granjasFiltered: any[] = [];

  filtro: Filtro[] = [
    {
      nameButton: 'Ordenar Granjas',
      data: [
        {
          id: 0,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: 'Calificación',
          datoafiltrar: 'puntuacion',
          modoFiltro: 'number_ordenarmayoramenor',
        },
        {
          id: 1,
          nombrecampoDB: 'area',
          nombrefiltro: 'Área',
          datoafiltrar: 'area',
          modoFiltro: 'number_ordenarmayoramenor',
        },
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    },
  ];
  palabra: string = '';
  filtroseleccionado!: MetaFiltro | null;
  contador = 0;
  modalGogleMapOpen: boolean = false;
  isAuthUser: boolean = false;

  constructor(
    httpClient: HttpClient,
    private granjasService: GranjasService,
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private location: Location,
    private appModalService: AppModalService,
    public location2: PlatformLocation,
    public mediaQueryService: MediaQueryService,
    public userService: UsuarioService,
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
  mediaQuery1!: Subscription;
  mediaQuery2!: Subscription;
  ngOnInit(): void {
    registerLocaleData(es);
    this.granjaDetailRoute =
      '/granjas/municipio/' + this.activatedRoute.snapshot.url[1] + '/detalle';
    this.granjasService
      .getGranjasMunicipio(Number(this.activatedRoute.snapshot.url[1]))
      .subscribe(
        (response) => {
          this.granjas = response.data;
          this.granjasFiltered = response.data;
          this.extractLatLong();
        },
        (err) => {
          console.error('Hay un error al obtener la lista de grajas');
          if (this.granjasFiltered.length == 0) {
            this.showNotFound = true;
          }
        }
      );
    this.placesService
      .getMunicipioById(Number(this.activatedRoute.snapshot.url[1]))
      .subscribe((response) => {
        if (response.data.length > 0) {
          const sucreColombia = {
            north: 10.184454,
            south: 8.136442,
            west: -75.842392,
            east: -74.324908,
          };
          this.poblacion = response.data[0].poblacion;
          this.municipio = response.data[0].nombre;
          this.options = {
            center: {
              lat: parseFloat(response.data[0].latitud),
              lng: parseFloat(response.data[0].longitud),
            },
            zoom: 13,
            scrollwheel: true,
            restriction: {
              latLngBounds: sucreColombia,
              strictBounds: false,
            },
          };
        }
      });
    this.mediaQuery2 = this.mediaQueryService
      .mediaQuery('min-width: 1100px')
      .subscribe((matches) => {
        if (matches && this.modalGogleMapOpen) {
          this.appModalService.CloseGoogleMapGeneralModal();
        }
      });
  }
  ngOnDestroy(): void {
    this.mediaQuery2.unsubscribe();
  }
  extractLatLong() {
    this.markerPositions = [];
    this.markersInfo = [];
    this.granjasFiltered.forEach((granja: Granja) => {
      let markerPosition: google.maps.LatLngLiteral = {
        lat: Number(granja.latitud),
        lng: Number(granja.longitud),
      };
      this.markerPositions.push(markerPosition);
      this.markersInfo.push({ markerPosition: markerPosition });
    });
  }

  onMouseCard(indexSelected: number) {
    this.indexSelected = indexSelected;
    this.markerPosition = {
      lat: Number(this.granjasFiltered[indexSelected].latitud),
      lng: Number(this.granjasFiltered[indexSelected].longitud),
    };
    this.openInfoWindow(this.marker, indexSelected);
  }

  eliminInfoWindow() {
    this.indexSelected = -1;
    if (this.granjasFiltered.length > 0 && this.mapaOn) {
      this.infoWindow.close();
    }
  }

  openInfoWindow(marker: MapMarker, index: number) {
    if (this.granjasFiltered.length > 0 && this.mapaOn) {
      this.indexSelected = index;
      this.infoWindow.open(marker);
      this.selectedGranja.nombregranja = this.granjasFiltered[index].nombre;
      this.selectedGranja.area = this.granjasFiltered[index].area;
      this.selectedGranja.dirreciongranja =
        this.granjasFiltered[index].direccion;
      this.selectedGranja.propietario.nombre =
        this.granjasFiltered[index].propietario ||
        this.granjasFiltered[index].propietarios[0].nombre_completo;
    }
  }
  openInfoWindowClick(marker: MapMarker, index: number) {
    if (this.granjasFiltered.length > 0 && this.mapaOn && this.contador == 0) {
      this.contador++;
      this.indexSelected = index;
      this.infoWindow.open(marker);
      this.selectedGranja.nombregranja = this.granjasFiltered[index].nombre;
      this.selectedGranja.area = this.granjasFiltered[index].area;
      this.selectedGranja.dirreciongranja =
        this.granjasFiltered[index].direccion;
      this.selectedGranja.propietario.nombre =
        this.granjasFiltered[index].propietario ||
        this.granjasFiltered[index].propietarios[0].nombre_completo;
    } else {
      this.contador = 0;
      this.eliminInfoWindow();
    }
  }
  navigate(id: number) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + id);
  }
  changeFavorite(i: number) {
    this.isAuthUser = this.userService.isAuthenticated();
    if (this.isAuthUser) {
      this.granjasFiltered[i].favorita =
        this.granjasFiltered[i].favorita == 1 ? 0 : 1;
      this.granjasService
        .esFavorita(this.granjasFiltered[i].id_granja)
        .subscribe(
          (response) => {
            console.log(response);
          },
          (err) => {
            console.log(err);
            this.granjasFiltered[i].favorita =
              this.granjasFiltered[i].favorita == 1 ? 0 : 1;
          }
        );
    } else if (!this.isAuthUser) {
         this.location2.onPopState(() => {
           this.appModalService.closeModalAlertSignu();
         });
      this.appModalService
        .modalAlertSignu()
        .then((result: any) => {
          if (result == 'registrate') {
             this.router.navigate(['/registro']);
          } else if (result == 'ingresar') {
            this.router.navigate(['/login']);
          }
        })
        .catch((result) => {});
    }

    //
  }

  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }
  mapainiciado() {
    this.mapaOn = true;
  }
  buscarData(texto: string): any {
    let granjassresult: any[];
    if (texto.trim().length === 0) {
      granjassresult = this.granjas;
    } else {
      let buscardatospor: BuscarPor[] = [
        { data1: 'nombre' },
        { data2: 'descripcion' },
      ];
      granjassresult = this.searchBuscadorService.buscarData(
        this.granjas,
        texto,
        buscardatospor
      );
    }
    if (granjassresult.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
    return granjassresult;
  }
  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.reseteoDeBusqueda();
  }

  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    let filtroresult: any[] = [];
    filtroresult = this.searchBuscadorService.filterSeleccionadoList(
      arrayafiltar,
      filtroSelecOptionData
    );
    console.log(filtroresult);
    return filtroresult;
  }
  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.reseteoDeBusqueda();
  }
  delateFilter() {
    this.filtroseleccionado = null;
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
    let resultados: any[] = this.buscarData(this.palabra);
    if (this.filtroseleccionado) {
      resultados = this.filtradoData(this.filtroseleccionado, resultados);
    }
    this.granjasFiltered = resultados;
    this.extractLatLong();
  }

  goBack() {
    this.location.back();

  }
}
