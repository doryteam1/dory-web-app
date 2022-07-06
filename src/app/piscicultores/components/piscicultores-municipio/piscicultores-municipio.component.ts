import { Component, OnInit, ViewChild } from '@angular/core';
import { Granja } from 'src/models/granja.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { PiscicultoresService } from '../../services/piscicultores.service';
import { environment } from 'src/environments/environment';
import { PlacesService } from 'src/app/services/places.service';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

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

  piscicultores: any[] = [];
  indexSelected: number = -1;
  poblacion: number = 0;
  municipio: string = '';
  selectedPiscicultor = {
    nombre: '',
    dirrecion: '',
  };
  mapaOn: boolean=false;

  constructor(
    httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private piscicultoresService: PiscicultoresService,
    private placesService: PlacesService,
    private router: Router
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
    console.log("url ",this.activatedRoute.snapshot.url)
    let path = this.activatedRoute.snapshot.url[0].path;
    let id = this.activatedRoute.snapshot.params.id;
console.log(path)
    if (path == 'asociacion') {
      this.piscicultoresService
        .getPiscicultoresAsociacion(id)
        .subscribe((response) => {
          this.piscicultores = response.data;
          this.municipio = response.municipio;
          this.extractLatLong();
        });
    } else if (path == 'municipio') {
      this.piscicultoresService
        .getPiscicultoresMunicipio(id)
        .subscribe((response) => {
          this.piscicultores = response.data;
          console.log(this.piscicultores);
           this.options = {
             center: {
               lat: Number(this.piscicultores[0].latitud),
               lng: Number(this.piscicultores[0].longitud),
             },
             zoom: 13,
           };
          this.extractLatLong();
        });
    }
    this.placesService.getMunicipioById(id).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.poblacion = response.data[0].poblacion;
          this.municipio = response.data[0].nombre;
          this.options = {
            center: {
              lat: parseFloat(response.data[0].latitud),
              lng: parseFloat(response.data[0].longitud),
            },
            zoom: 13,
          };
        }
      },
      (err) => {}
    );
  }

  extractLatLong() {
    this.piscicultores.forEach((piscicultor: any) => {
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
      lat: Number(this.piscicultores[indexSelected].latitud),
      lng: Number(this.piscicultores[indexSelected].longitud),
    };
       this.options = {
         center: {
           lat: Number(this.piscicultores[indexSelected].latitud),
           lng: Number(this.piscicultores[indexSelected].longitud),
         },
         zoom: 13,
       };
    this.openInfoWindow(this.marker, indexSelected);
  }
  eliminInfoWindow() {
    if (this.piscicultores.length > 0 && this.mapaOn) {
      this.infoWindow.close();
      this.indexSelected = -1;
    }
  }
  openInfoWindow(marker: MapMarker, index: number) {
    if (this.piscicultores.length > 0 && this.mapaOn) {
      this.indexSelected = index;
      this.infoWindow.open(marker);
      this.selectedPiscicultor.nombre = this.piscicultores[index].nombre;
      this.selectedPiscicultor.dirrecion = this.piscicultores[index].direccion;
    }
  }
  navigate(id: number) {
    this.router.navigateByUrl('/piscicultores/municipio/detalle/' + id);
  }
  mapainiciado() {
      this.mapaOn = true;
  }
}
