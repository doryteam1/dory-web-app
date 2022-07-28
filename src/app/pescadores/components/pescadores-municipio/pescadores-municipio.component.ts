import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { environment } from 'src/environments/environment';
import { PlacesService } from 'src/app/services/places.service';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Router } from '@angular/router';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { vertices } from '../../../global/constants';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';

@Component({
  selector: 'app-pescadores-municipio',
  templateUrl: './pescadores-municipio.component.html',
  styleUrls: ['./pescadores-municipio.component.scss'],
})
export class PescadoresMunicipioComponent implements OnInit {
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
  selectedPescador = {
    nombre: '',
    dirrecion: '',
    celular: '',
  };
  mapaOn: boolean = false;
  showNotFound: boolean = false;
  pescadoresarray: any[] = [];
  pescadores: any[] = [];
  /*  filtros: any[] = [
    {
      data: [
        {
          nombrefiltro: 'Calificación',
          datoafiltrar: 'puntuacion',
        },
        {
          nombrefiltro: 'Área',
          datoafiltrar: 'area',
        },
      ],
    },
  ]; */

  constructor(
    httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private pescadoresService: PescadoresService,
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
    let path = this.activatedRoute.snapshot.url[0].path;
    let id = this.activatedRoute.snapshot.params.id;

    if (path == 'asociacion') {
      this.pescadoresService
        .getPescadoresAsociacion(id)
        .subscribe((response: any) => {
          console.log(response);
          this.pescadores = response.data;
          this.municipio = response.municipio;
          this.extractLatLong();
        });
    } else if (path == 'municipio') {
      this.pescadoresService
        .getPescadoresMunicipio(id)
        .subscribe((response: any) => {
          console.log(response);
          this.pescadores = response.data;
          this.pescadoresarray = response.data;
          console.log(this.pescadoresarray);
          if (this.pescadores.length !== 0) {
            this.showNotFound = false;
          } else {
            this.showNotFound = true;
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
          this.extractLatLong();
        });
    }
    console.log(this.activatedRoute.snapshot.url[0].path);
  }

  extractLatLong() {
    this.markerPositions = [];
    this.markersInfo = [];
    this.pescadores.forEach((pescador: any) => {
      let markerPosition: google.maps.LatLngLiteral = {
        lat: Number(pescador.latitud),
        lng: Number(pescador.longitud),
      };
      this.markerPositions.push(markerPosition);
      this.markersInfo.push({
        markerPosition: markerPosition,
        title: pescador.nombre,
      });
    });
    /*  console.log(JSON.stringify(this.markersInfo)); */
  }
  onMouseCard(pescador: any, indexSelected: number) {
    this.indexSelected = indexSelected;
    console.log(this.indexSelected);
    this.markerPosition = {
      lat: Number(pescador.latitud),
      lng: Number(pescador.longitud),
    };
    this.openInfoWindow(this.marker, indexSelected);
  }
  eliminInfoWindow() {
    if (this.pescadores.length > 0 && this.mapaOn) {
      this.infoWindow.close();
      this.indexSelected = -1;
    }
  }
  openInfoWindow(marker: MapMarker, index: number) {
    if (this.pescadores.length > 0 && this.mapaOn) {
      this.indexSelected = index;
      this.infoWindow.open(marker);
      this.selectedPescador.nombre = this.pescadores[index].nombre;
      this.selectedPescador.dirrecion = this.pescadores[index].direccion;
      this.selectedPescador.celular = this.pescadores[index].celular;
    }
  }
  mapainiciado() {
    this.mapaOn = true;
  }
  goPescadorDetail(pescador: any) {
    this.router.navigateByUrl('/pescadores/municipio/detalle/' + pescador.id);
  }
  /* funciones de busqueda granjas */

  buscarData(texto: string): any {
    if (texto.trim().length === 0) {
       this.pescadores=this.pescadoresarray;
    }else{
      let buscardatospor: BuscarPor[]= [{ data1: 'nombre' }, { data2: 'celular' }];
     this.pescadores = this.searchBuscadorService.buscarData(
       this.pescadoresarray,
       texto,
       buscardatospor
     );
      this.extractLatLong();
    }
  }
}
