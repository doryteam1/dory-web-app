import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GeocoderResponse } from 'src/models/geocoder-response.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private https:HttpsService, private httpClient:HttpClient) { }

  getDepartamentos(){
    return this.https.get(environment.doryApiRestBaseUrl+"/departamentos");
  }

  getMunicipiosDepartamentos(idDepartamento:number){
    return this.https.get(environment.doryApiRestBaseUrl+"/municipios/departamento/"+idDepartamento);
  }

  getCorregimientosMunicipio(idMunicipio:number){
    return this.https.get(environment.doryApiRestBaseUrl+"/corregimientos/municipio/"+idMunicipio);
  }

  getVeredasMunicipio(idMunicipio:number){
    return this.https.get(environment.doryApiRestBaseUrl+"/veredas/municipio/"+idMunicipio);
  }

  getMunicipioById(idMunicipio:number){
    return this.https.get(environment.doryApiRestBaseUrl+"/municipios/"+idMunicipio);
  }

  geocodeLatLng(location: google.maps.LatLngLiteral): Promise<GeocoderResponse> {
    let geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ 'location': location }, (results, status) => {
        const response = new GeocoderResponse(status, results!);
        resolve(response);
      });
    });
  }
}
