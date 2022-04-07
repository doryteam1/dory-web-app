import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

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
}
