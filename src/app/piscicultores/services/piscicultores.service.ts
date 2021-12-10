import { Injectable } from '@angular/core';
import { HttpsService } from 'src/app/services/https.service';

@Injectable({
  providedIn: 'root'
})
export class PiscicultoresService {

  constructor(private https:HttpsService) { }

  getPiscicultoresAsociacion(idAsociacion:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/piscicultores/asociacion/"+idAsociacion);
  }

  getPiscicultores(){
    return this.https.get("https://dory-api-rest.herokuapp.com/piscicultores");
  }

  getPiscicultoresMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/piscicultores/municipio/"+idMunicipio);
  }
}
