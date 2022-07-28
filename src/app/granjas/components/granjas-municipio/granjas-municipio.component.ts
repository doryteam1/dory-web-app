import { Component, OnInit, ViewChild } from '@angular/core';
import { Granja } from 'src/models/granja.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GranjasService } from '../../services/granjas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { environment } from 'src/environments/environment';
import { PlacesService } from 'src/app/services/places.service';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';
import { vertices } from '../../../global/constants';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from '../../../../models/buscarPor.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';

@Component({
  selector: 'app-granjas-municipio',
  templateUrl: './granjas-municipio.component.html',
  styleUrls: ['./granjas-municipio.component.scss'],
})
export class GranjasMunicipioComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('marker') marker!: MapMarker;
  singranjas: boolean = false;
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  indexSelected: number = -1;
  granjaDetailRoute: string = '';
  poblacion: number = 0;
  municipio: string = '';
  valorrows: number = 18.25;
  valorcolumns: number = 21.8333333333;
  indicatorsphotos: boolean = true;
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
  granjasarray: any[] = [];
  granjas: any[] = [];

  filtro: Filtro[] = [
    {
      nameButton: 'Filtrar Granjas',
      data: [
        {
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Calificación',
          datoafiltrar: 'puntuacion',
          modoFiltro: 'number_ordenarmayoramenor',
        },
        {
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Área',
          datoafiltrar: 'area',
          modoFiltro: 'number_ordenarmayoramenor',
        },
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    },
  ];
  palabra: string = '';
  filtroseleccionado!: MetaFiltro;

  constructor(
    httpClient: HttpClient,
    private granjasService: GranjasService,
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService
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
    registerLocaleData(es);
    this.granjaDetailRoute =
      '/granjas/municipio/' + this.activatedRoute.snapshot.url[1] + '/detalle';
    this.granjasService
      .getGranjasMunicipio(Number(this.activatedRoute.snapshot.url[1]))
      .subscribe(
        (response) => {
          this.granjasarray = response.data;
          this.granjas = response.data;
          console.log(this.granjas);
          this.extractLatLong();
        },
        (err) => {
          console.error('Hay un error al obtener la lista de grajas');
          if (this.granjas.length == 0) {
            this.singranjas = true;
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
  }

  extractLatLong() {
    this.markerPositions = [];
    this.markersInfo = [];
    this.granjas.forEach((granja: Granja) => {
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
      lat: Number(this.granjas[indexSelected].latitud),
      lng: Number(this.granjas[indexSelected].longitud),
    };
    this.openInfoWindow(this.marker, indexSelected);
  }

  eliminInfoWindow() {
    this.indexSelected = -1;
    if (this.granjas.length > 0 && this.mapaOn) {
      this.infoWindow.close();
    }
  }

  openInfoWindow(marker: MapMarker, index: number) {
    if (this.granjas.length > 0 && this.mapaOn) {
      this.indexSelected = index;
      this.infoWindow.open(marker);
      this.selectedGranja.nombregranja = this.granjas[index].nombre;
      this.selectedGranja.area = this.granjas[index].area;
      this.selectedGranja.dirreciongranja = this.granjas[index].direccion;
      this.selectedGranja.propietario.nombre =
        this.granjas[index].propietario ||
        this.granjas[index].propietarios[0].nombre_completo;
    }
  }

  navigate(id: number) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + id);
  }
  changeFavorite(i: number) {
    let date = new Date();
    console.log(date.toISOString().split('T')[0]);
    const horas = new Date();

    console.log(horas.getHours());

    this.granjas[i].favorita = this.granjas[i].favorita == 1 ? 0 : 1;
    this.granjasService.esFavorita(this.granjas[i].id_granja).subscribe(
      (response) => {
        console.log(response);
      },
      (err) => {
        console.log(err);
        this.granjas[i].favorita = this.granjas[i].favorita == 1 ? 0 : 1;
      }
    );
    //this.proveedorService.updateProducto(this.form)
  }

  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }
  mapainiciado() {
    this.mapaOn = true;
  }

  /* funciones de busqueda granjas */
  /*  buscarData(texto: string): any {
    if (texto.trim().length == 0) {
      this.granjas = this.granjasarray;
      this.extractLatLong();
    } else {
      let buscardatospor: BuscarPor[] = [
        { data1: 'nombre' },
        { data2: 'descripcion' },
      ];
      this.granjas = this.searchBuscadorService.buscarData(
        this.granjasarray,
        texto,
        buscardatospor
      );
      this.extractLatLong();
    }
  } */
  buscarData(texto: string): any {
    let granjassresult: any[];
    if (texto.trim().length === 0) {
      granjassresult = this.granjasarray;
    } else {
      let buscardatospor: BuscarPor[] = [
        { data1: 'nombre' },
        { data2: 'descripcion' },
      ];
      granjassresult = this.searchBuscadorService.buscarData(
        this.granjasarray,
        texto,
        buscardatospor
      );
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
    return filtroresult;
  }
  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
    let resultados: any[] = this.buscarData(this.palabra);
    if (this.filtroseleccionado) {
      resultados = this.filtradoData(this.filtroseleccionado, resultados);
    }
    this.granjas = resultados;
    this.extractLatLong();
  }
  /*   filtradoData(datafilter: any) {
    this.granjas = this.searchBuscadorService.filterSeleccionadoList(
      this.granjasarray,
      datafilter
    );
    this.extractLatLong();
  } */
}
