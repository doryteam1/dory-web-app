import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private https:HttpsService) { }

  getDepartamentos(){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/departamentos");
  }

  getMunicipiosDepartamentos(idDepartamento:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/municipios/departamento/"+idDepartamento);
  }

  getCorregimientosMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/corregimientos/municipio/"+idMunicipio);
  }

  getVeredasMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/veredas/municipio/"+idMunicipio);
  }

  getMunicipioById(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/municipios/"+idMunicipio);
  }

  getDptoMunicByLatLng(lat:number,lng:number){
    return this.https.get("https://maps.googleapis.com/maps/api/geocode/json?latlng= "+lat+", "+lng+"&key="+environment.doryApiKey).pipe(
      map(x=>console.log(x))
    )

    /*return this.https.get("https://maps.googleapis.com/maps/api/geocode/json?latlng= 9.2216946, -75.2784789&key=AIzaSyDxAJesdH6yoUCT79wtRqXYKSevJsPD0TU").pipe(
      map(x=>console.log(x))
    )*/
  }
}
