import { Component, OnInit } from '@angular/core';
import { Granja } from 'src/models/granja.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AsociacionesService } from '../../services/asociaciones.service';
@Component({
  selector: 'app-asociaciones-municipio',
  templateUrl: './asociaciones-municipio.component.html',
  styleUrls: ['./asociaciones-municipio.component.scss']
})
export class AsociacionesMunicipioComponent implements OnInit {
  apiLoaded: Observable<boolean>;  
  asociaciones:any[] = [];

  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng:-75.188469 },
    zoom:10
  }

  markerPosition : google.maps.LatLngLiteral = { lat: 9.214145, lng:-75.188469 };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  indexSelected:number = -1;

  constructor(httpClient: HttpClient, private asociacionesService:AsociacionesService) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDVBMpPnWkfUkXBDDBW-vqj_Zeq8PNzYUE', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
   }

  ngOnInit(): void {
    this.asociacionesService.getAsociaciones().subscribe(
      (response)=>{
        console.log(response.data)
        this.asociaciones = response.data;
        this.extractLatLong();
      }
    );
  }

  extractLatLong(){
    this.asociaciones.forEach(
      (asociacion : Granja)=>{
        let markerPosition: google.maps.LatLngLiteral = { lat:Number(asociacion.latitud), lng:Number(asociacion.longitud) };
        this.markerPositions.push(markerPosition);
        this.markersInfo.push({markerPosition: markerPosition, title: asociacion.nombre});
      }
    );
  }
  changeFavorite(){
    
  }

  onMouseCard(indexSelected:number){
    this.indexSelected = indexSelected;
    console.log(indexSelected);
    /* this.options = {
      center: { lat: Number(granja.latitud), lng:Number(granja.longitud) },
      zoom:15
    }
    console.log(granja); */
  }
}
