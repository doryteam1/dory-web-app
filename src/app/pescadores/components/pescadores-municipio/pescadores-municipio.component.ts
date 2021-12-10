import { Component, OnInit } from '@angular/core';
import { Granja } from 'src/models/granja.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
@Component({
  selector: 'app-pescadores-municipio',
  templateUrl: './pescadores-municipio.component.html',
  styleUrls: ['./pescadores-municipio.component.scss']
})
export class PescadoresMunicipioComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  granjas:Array<Granja> = [];

  
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng:-75.188469 },
    zoom:6
  }

  markerPosition : google.maps.LatLngLiteral = { lat: 9.214145, lng:-75.188469 };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = {draggable: false};

  pescadores:any[] = [];

  constructor(httpClient: HttpClient, private activatedRoute: ActivatedRoute, private pescadoresService:PescadoresService) {
    let path = this.activatedRoute.snapshot.url[0].path;
    let id = this.activatedRoute.snapshot.params.id;

    if(path == 'asociacion'){
      this.pescadoresService.getPescadoresAsociacion(id).subscribe(
        (response:any)=>{
          console.log(response);
          this.pescadores = response.data;
        }
      );
    }else if(path == 'municipio'){
      this.pescadoresService.getPescadoresMunicipio(id).subscribe(
        (response:any)=>{
          console.log(response);
          this.pescadores = response.data;
        }
      );
    }
    console.log(this.activatedRoute.snapshot.url[0].path);

    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDVBMpPnWkfUkXBDDBW-vqj_Zeq8PNzYUE', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
   }

  ngOnInit(): void {
    this.extractLatLong();
  }

  extractLatLong(){
    this.granjas.forEach(
      (granja : Granja)=>{
        let markerPosition: google.maps.LatLngLiteral = { lat:granja.latitud, lng:granja.longitud };
        this.markerPositions.push(markerPosition);
        this.markersInfo.push({markerPosition: markerPosition, title: granja.nombre});
      }
    );
  }
  changeFavorite(){
    
  }
}
