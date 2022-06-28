import { Injectable } from '@angular/core';
import { HttpsService } from 'src/app/services/https.service';

@Injectable({
  providedIn: 'root'
})
export class AsociacionesService {

  constructor(private https:HttpsService) {

  }

  getAsociaciones(){
    //return this.https.get("https://dory-api-rest.herokuapp.com/granjas");
    return this.https.get("https://dory-api-rest.herokuapp.com/api/asociaciones");
  }

  getAsociacionesMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/asociaciones/municipio/"+idMunicipio);
  }

  getAsociacionesDpto(dptoId:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/asociaciones/departamento/'+dptoId);
  }

  getAsociacionesUsuario(idUsuario:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/asociaciones/usuario/'+idUsuario)
  }

  add(asociacion:any){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/asociaciones',asociacion)
  }

  delete(nit:number){
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/asociaciones/'+nit)
  }

  update(nit:number,newDataAsociacion:any){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/asociaciones/'+nit,newDataAsociacion)
  }

  detail(nit:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/asociaciones/'+nit)
  }

  tiposAsociacion(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/tipos-asociaciones');
  }
}


