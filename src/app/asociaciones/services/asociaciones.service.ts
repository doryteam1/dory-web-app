import { Injectable } from '@angular/core';
import { HttpsService } from 'src/app/services/https.service';

@Injectable({
  providedIn: 'root'
})
export class AsociacionesService {

  constructor(private https:HttpsService) {

  }

  getAsociaciones(){
    return this.https.get("https://dory-api-rest.herokuapp.com/granjas");
    //return this.https.get("https://dory-api-rest.herokuapp.com/asociaciones");
  }

  getGranjasMunicipio(idMunicipio:number){
    //return this.https.get("https://dory-api-rest.herokuapp.com/api/asociaciones/municipio/"+idMunicipio);
  }
}


