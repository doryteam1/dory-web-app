import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PescadoresService {

  constructor(private https:HttpClient) { }
  
  getPescadores(){
    return this.https.get("https://dory-api-rest.herokuapp.com/pescadores");
  }

  getPescadoresMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/pescadores/municipio/"+idMunicipio);
  }

  getPescadoresAsociacion(idAsociacion:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/pescadores/asociacion/"+idAsociacion);
  }

  getPescadoresDepartamento(idDpto:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/pescadores/departamento/"+idDpto);
  }

  getPescadoresEstadoSolicitud(nit:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/usuario/pescador/asociacion/'+nit)
  }
}
