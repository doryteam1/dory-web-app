import { Component, OnInit, ViewChild } from '@angular/core';
import { Granja } from 'src/models/granja.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { PiscicultoresService } from '../../services/piscicultores.service';
import { environment } from 'src/environments/environment';
import { PlacesService } from 'src/app/services/places.service';
import { Location, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { vertices } from '../../../global/constants';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';

@Component({
  selector: 'app-piscicultores-municipio',
  templateUrl: './piscicultores-municipio.component.html',
  styleUrls: ['./piscicultores-municipio.component.scss'],
})
export class PiscicultoresMunicipioComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('marker') marker!: MapMarker;
  apiLoaded: Observable<boolean>;

  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng: -75.188469 },
    zoom: 11.5,
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 9.214145,
    lng: -75.188469,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  vertices = vertices;
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };

  indexSelected: number = -1;
  poblacion: number = 0;
  municipio: string = '';
  selectedPiscicultor = {
    nombre: '',
    dirrecion: '',
  };
  mapaOn: boolean = false;
  showNotFound: boolean = false;
  piscicultores: any[] = [];
  piscicultoresFiltered: any[] = [];
  contador = 0;
  constructor(
    httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private piscicultoresService: PiscicultoresService,
    private placesService: PlacesService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private location: Location
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
    console.log('url ', this.activatedRoute.snapshot.url);
    let path = this.activatedRoute.snapshot.url[0].path;
    let id = this.activatedRoute.snapshot.params.id;
    console.log(path);
    if (path == 'asociacion') {
      this.piscicultoresService
        .getPiscicultoresAsociacion(id)
        .subscribe((response) => {
          this.piscicultoresFiltered = response.data;
          this.municipio = response.municipio;
          this.extractLatLong();
        });
    } else if (path == 'municipio') {
      this.piscicultoresService
        .getPiscicultoresMunicipio(id)
        .subscribe((response) => {
          this.piscicultoresFiltered = response.data;
          this.piscicultores = response.data;
          console.log(this.piscicultoresFiltered);
          if (this.piscicultoresFiltered.length !== 0) {
            this.showNotFound = false;
          } else {
            this.showNotFound = true;
          }
          this.options = {
            center: {
              lat: Number(this.piscicultoresFiltered[0].latitud),
              lng: Number(this.piscicultoresFiltered[0].longitud),
            },
            zoom: 13,
          };
          this.extractLatLong();
        });
    }
    this.placesService.getMunicipioById(id).subscribe(
      (response) => {
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
      },
      (err) => {}
    );
  }

  extractLatLong() {
    this.markerPositions = [];
    this.markersInfo = [];
    this.piscicultoresFiltered.forEach((piscicultor: any) => {
      let markerPosition: google.maps.LatLngLiteral = {
        lat: Number(piscicultor.latitud),
        lng: Number(piscicultor.longitud),
      };
      this.markerPositions.push(markerPosition);
      this.markersInfo.push({ markerPosition: markerPosition });
    });

    /* console.log(JSON.stringify(this.markersInfo)); */
  }
  onMouseCard(piscicultor: any, indexSelected: number) {
    this.indexSelected = indexSelected;
    this.markerPosition = {
      lat: Number(this.piscicultoresFiltered[indexSelected].latitud),
      lng: Number(this.piscicultoresFiltered[indexSelected].longitud),
    };
    this.openInfoWindow(this.marker, indexSelected);
  }
  eliminInfoWindow() {
    if (this.piscicultoresFiltered.length > 0 && this.mapaOn) {
      this.infoWindow.close();
      this.indexSelected = -1;
    }
  }
  openInfoWindow(marker: MapMarker, index: number) {
    if (this.piscicultoresFiltered.length > 0 && this.mapaOn) {
      this.indexSelected = index;
      this.infoWindow.open(marker);
      this.selectedPiscicultor.nombre =
        this.piscicultoresFiltered[index].nombre;
      this.selectedPiscicultor.dirrecion =
        this.piscicultoresFiltered[index].direccion;
    }
  }
  openInfoWindowClick(marker: MapMarker, index: number) {
    if (this.piscicultoresFiltered.length > 0 && this.mapaOn && this.contador == 0) {
      this.contador++;
      this.indexSelected = index;
      this.infoWindow.open(marker);
      this.selectedPiscicultor.nombre =
        this.piscicultoresFiltered[index].nombre;
      this.selectedPiscicultor.dirrecion =
        this.piscicultoresFiltered[index].direccion;
    } else {
      this.contador = 0;
      this.eliminInfoWindow();
    }
  }

  navigate(piscicultor: any) {
    this.router.navigateByUrl(
      '/piscicultores/municipio/detalle/' + piscicultor.id
    );
  }
  mapainiciado() {
    this.mapaOn = true;
  }
  /* funciones de busqueda granjas */
  buscarData(texto: string): any {
    if (texto.trim().length === 0) {
      this.piscicultoresFiltered = this.piscicultores;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }];
      this.piscicultoresFiltered = this.searchBuscadorService.buscarData(
        this.piscicultores,
        texto,
        buscardatospor
      );
    }
    if (this.piscicultoresFiltered.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
    this.extractLatLong();
  }

  goBack() {
    this.location.back();
  }
}
