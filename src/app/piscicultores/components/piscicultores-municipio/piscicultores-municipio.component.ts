import { Component, OnInit } from '@angular/core';
import { Granja } from 'src/models/granja.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PiscicultoresService } from '../../services/piscicultores.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-piscicultores-municipio',
  templateUrl: './piscicultores-municipio.component.html',
  styleUrls: ['./piscicultores-municipio.component.scss']
})
export class PiscicultoresMunicipioComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng:-75.188469 },
    zoom:11.5
  }

  markerPosition : google.maps.LatLngLiteral = { lat: 9.214145, lng:-75.188469 };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = {draggable: false};

  piscicultores:any[] = [];
  indexSelected:number = -1;
  
  constructor(httpClient: HttpClient, private activatedRoute:ActivatedRoute, private piscicultoresService:PiscicultoresService) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key='+environment.doryApiKey, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
   }

  ngOnInit(): void {
    let path = this.activatedRoute.snapshot.url[0].path;
    let id = this.activatedRoute.snapshot.params.id;

    if(path == "asociacion"){
      this.piscicultoresService.getPiscicultoresAsociacion(id).subscribe(
        (response)=>{
          this.piscicultores = response.data;
          this.extractLatLong();
        }
      );
    }else if(path == "municipio"){
      this.piscicultoresService.getPiscicultoresMunicipio(id).subscribe(
        (response)=>{
          this.piscicultores = response.data;
          this.extractLatLong();
        }
      );
    }
    
  }

  extractLatLong(){
    this.piscicultores.forEach(
      (piscicultor : any)=>{
        let markerPosition: google.maps.LatLngLiteral = { lat:Number(piscicultor.latitud), lng:Number(piscicultor.longitud) };
        this.markerPositions.push(markerPosition);
        this.markersInfo.push({markerPosition: markerPosition, title: piscicultor.nombre});
      }
    );

    console.log(JSON.stringify(this.markersInfo));
  }
  changeFavorite(){
    
  }

  onMouseCard(piscicultor:any, indexSelected:number){
    this.indexSelected = indexSelected;
    console.log(indexSelected);
    /*this.options = {
      center: { lat: Number(piscicultor.latitud), lng:Number(piscicultor.longitud) },
      zoom:12
    }*/

  }
}
