import { Component, OnInit } from '@angular/core';
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

  
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng:-75.188469 },
    zoom:6
  }

  markerPosition : google.maps.LatLngLiteral = { lat: 9.214145, lng:-75.188469 };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = {draggable: false};

  pescadores:any[] = [];
  indexSelected:number = -1;
  
  constructor(httpClient: HttpClient, private activatedRoute: ActivatedRoute, private pescadoresService:PescadoresService) {
   
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDVBMpPnWkfUkXBDDBW-vqj_Zeq8PNzYUE', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
   }

  ngOnInit(): void {
    let path = this.activatedRoute.snapshot.url[0].path;
    let id = this.activatedRoute.snapshot.params.id;

    if(path == 'asociacion'){
      this.pescadoresService.getPescadoresAsociacion(id).subscribe(
        (response:any)=>{
          console.log(response);
          this.pescadores = response.data;
          this.extractLatLong();
        }
      );
    }else if(path == 'municipio'){
      this.pescadoresService.getPescadoresMunicipio(id).subscribe(
        (response:any)=>{
          console.log(response);
          this.pescadores = response.data;
          this.extractLatLong();
        }
      );
    }
    console.log(this.activatedRoute.snapshot.url[0].path);
  }

  extractLatLong(){
    this.pescadores.forEach(
      (pescador : any)=>{
        let markerPosition: google.maps.LatLngLiteral = { lat:Number(pescador.latitud), lng:Number(pescador.longitud) };
        this.markerPositions.push(markerPosition);
        this.markersInfo.push({markerPosition: markerPosition, title: pescador.nombre});
      }
    );
    console.log(JSON.stringify(this.markersInfo));
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
