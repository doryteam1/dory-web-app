
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { PlatformLocation } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { GranjasService } from 'src/app/granjas/services/granjas.service';

@Component({
  selector: 'app-modal-google-map',
  templateUrl: './modal-google-map.component.html',
  styleUrls: ['./modal-google-map.component.scss'],
})
export class ModalGoogleMapComponent implements OnInit {
  @Input() atributos: any = {};
  @Input() modalheader!: boolean;
  @Input() shared: boolean=true;
  @Input() iconMarkerGoogleMap!:string
  @Input() iconMarkerGoogleMap2!:string
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('marker') marker!: MapMarker;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  misfavoritas: any[] = [];
  mapaOn:boolean=false
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng: -75.188469 },
    zoom: 5,
    scrollwheel: true,
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 9.214145,
    lng: -75.188469,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  apiLoaded!: Observable<boolean>;
  indexSelected: number = -1;
  selectedfavorito = {
    propietario: {
      nombre: '',
    },
    granja: {
      nombre: '',
      direccion: '',
      area: '',
    },
  };
  ngOnInit(): void {
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
      this.misfavoritas = this.atributos;
      this.extractLatLong();
      this.options = {
        center: {
          lat: parseFloat(this.misfavoritas[0].latitud),
          lng: parseFloat(this.misfavoritas[0].longitud),
        },
        zoom: 5,
        scrollwheel: true,
        restriction: {
          latLngBounds: sucreColombia,
          strictBounds: false,
        },
        streetViewControl: false,
        fullscreenControl: false,

        /* https://developers.google.com/maps/documentation/javascript/controls */
      };
      this.markerPosition = {
        lat: parseFloat(this.misfavoritas[0].latitud),
        lng: parseFloat(this.misfavoritas[0].longitud),
      };


  }

  constructor(
    httpClient: HttpClient,
    private _modalService: NgbActiveModal,
    private appModalService: AppModalService,
    public location: PlatformLocation,
    private router: Router,
    private granjasService: GranjasService
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
  mapainiciado() {
    /* https://www.freakyjolly.com/angular-google-maps-integration-with-markers-info-windows-tutorial/ */
      this.mapaOn=true
  }
  extractLatLong() {
      this.misfavoritas.forEach((favoritoslatlong: any) => {
        let markerPosition: google.maps.LatLngLiteral = {
          lat: Number(favoritoslatlong.latitud),
          lng: Number(favoritoslatlong.longitud),
        };
        this.markerPositions.push(markerPosition);
        this.markersInfo.push({ markerPosition: markerPosition });
      });
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
  openInfoWindowvarios(marker: MapMarker, index: number) {
    if (this.mapaOn) {
      this.infoWindow.open(marker);
      this.indexSelected=index
      this.selectedfavorito.granja.nombre = this.misfavoritas[index].nombre;
      this.selectedfavorito.granja.direccion =
        this.misfavoritas[index].direccion;
      this.selectedfavorito.granja.area = this.misfavoritas[index].area;
      this.selectedfavorito.propietario.nombre =
        this.misfavoritas[index].propietario;
    }
  }
  eliminInfoWindowvarios() {
    if (this.mapaOn) {
      this.infoWindow.close();
      this.indexSelected = -1;
    }
  }
  shareFuntionvarios(i: number) {
      this.location.onPopState(() => {
        this.appModalService.closeModalShare();
      });
      this.appModalService
        .shared(
          'Compartir ubicación de la granja',
          true,
          `https://www.google.com/maps?q=${this.misfavoritas[i].latitud},${this.misfavoritas[i].longitud}`,
          `Echa un vistazo a la ubicación de la granja: ${this.misfavoritas[i].nombre}`
        )
        .then((result) => {})
        .catch((result) => {});
  }
  navigate(i: number) {
      // Converts the route into a string that can be used
      // with the window.open() function
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          `/granjas/municipio/detalle/${this.misfavoritas[i].id_granja}`,
        ])
      );
      window.open(url, '_blank');

  }
 async changeFavorite(i: number) {
    const confirmed: boolean = await this.appModalService.confirm(
      'Eliminar de favoritos',
      '¿Está seguro que desea quitar esta granja de mis favoritos?',
      'Sí',
      'No'
    );

    if (confirmed) {
      const granja = this.misfavoritas[i];
      granja.esfavorita = granja.esfavorita === 1 ? 0 : 1;

      try {
        await this.granjasService.esFavorita(granja?.id_granja).toPromise();
        this.misfavoritas.splice(i, 1);
        this.markersInfo.splice(i, 1);

        if (this.misfavoritas.length <= 0) {
          this.appModalService.CloseGoogleMapModal();
        }
      } catch (err) {
        console.log(err);
        granja.esfavorita = granja.esfavorita === 1 ? 0 : 1;
      }
    }
  }
  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }
  onMouseCard(indexSelected: number) {
    if (this.mapaOn) {
      this.indexSelected = indexSelected;
      this.markerPosition = {
        lat: Number(this.misfavoritas[indexSelected].latitud),
        lng: Number(this.misfavoritas[indexSelected].longitud),
      };
        this.options = {
          center: {
            lat: parseFloat(this.misfavoritas[indexSelected].latitud),
            lng: parseFloat(this.misfavoritas[indexSelected].longitud),
          },
          zoom: 13,
          /* https://developers.google.com/maps/documentation/javascript/controls */
        };
      this.openInfoWindowvarios(this.marker, indexSelected);
    }
  }
  /* https://www.google.com/maps?q=9.30549009,-75.39163455 */
}
