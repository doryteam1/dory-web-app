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


@Component({
  selector: 'app-granjas-municipio',
  templateUrl: './granjas-municipio.component.html',
  styleUrls: ['./granjas-municipio.component.scss']
})
export class GranjasMunicipioComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  granjas:any[] = [];
valor:boolean=false
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng:-75.188469 },
    zoom:10,
     scrollwheel: true,
  }

  markerPosition : google.maps.LatLngLiteral = { lat: 9.214145, lng:-75.188469 };
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  markerOptions: google.maps.MarkerOptions = {draggable: false,};
  indexSelected:number = -1;
  granjaDetailRoute:string = "";
  poblacion:number = 0;
  municipio:string = '';
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild("marker") marker!: MapMarker;
  selectedGranja = {
    nombre : '',
    propietario : {
      nombre : ''
    }
  }
  constructor(httpClient: HttpClient,
              private granjasService:GranjasService,
              private activatedRoute:ActivatedRoute,
              private placesService:PlacesService,
              private router:Router) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key='+environment.doryApiKey, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
   }

  ngOnInit(): void {
    registerLocaleData( es );
    this.granjaDetailRoute = "/granjas/municipio/" + this.activatedRoute.snapshot.url[1] +"/detalle";
    console.log(this.activatedRoute.snapshot.url[1])
    this.granjasService.getGranjasMunicipio(Number(this.activatedRoute.snapshot.url[1])).subscribe(
      (response)=>{
        this.granjas = response.data;
        this.extractLatLong();
      }
    );
    this.placesService.getMunicipioById(Number(this.activatedRoute.snapshot.url[1])).subscribe(
      (response)=>{
        if(response.data.length > 0){
          this.poblacion = response.data[0].poblacion;
          this.municipio = response.data[0].nombre;
          this.options = {
            center: { lat: parseFloat(response.data[0].latitud), lng:parseFloat(response.data[0].longitud)},
            zoom:13
          }
        }
      }
    );
  }

  extractLatLong(){
    this.granjas.forEach(
      (granja : Granja)=>{
        let markerPosition: google.maps.LatLngLiteral = { lat:Number(granja.latitud), lng:Number(granja.longitud) };
        this.markerPositions.push(markerPosition);
        this.markersInfo.push({markerPosition: markerPosition});
      }
    );
  }


  onMouseCard( indexSelected:number){
    console.log(this.granjas)
      this.indexSelected = indexSelected;
      this.markerPosition = {
      lat: Number(this.granjas[indexSelected].latitud),
      lng:Number(this.granjas[indexSelected].longitud),
    };
    this.openInfoWindow(this.marker, indexSelected)
    /* console.log(this.markersInfo[indexSelected].markerPosition=this.markerPosition) */
    /*  this.markersInfo.push({markerPosition: this.markerPosition}); */
  }

  eliminInfoWindow(){
    this.infoWindow.close()
    this.indexSelected=-1
  }

  openInfoWindow(marker: MapMarker, index:number) {
    this.infoWindow.open(marker);
    this.selectedGranja.nombre = this.granjas[index].nombre;
    this.selectedGranja.propietario.nombre = this.granjas[index].propietario;
  }

  navigate(id:number){
    this.router.navigateByUrl('/granjas/municipio/detalle/'+id)
  }
  changeFavorite(i:number) {
    this.granjas[i].favorita = this.granjas[i].favorita == 1 ? 0 : 1;  
    this.granjasService
      .esFavorita(
        this.granjas[i].id_granja
      )
      .subscribe(
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

  showResenas(idGranja:number){
    this.granjasService.showResenasModal('Reseñas','Cerrar',idGranja);
  }

}
