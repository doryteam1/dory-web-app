import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private https:HttpsService) { }

  getNegociosByUserId(id:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/negocios/usuario/'+id)
  }

  getNegociosAll(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/negocios/')
  }

  addNegocio(negocio:any){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/negocios',negocio)
  }

  updateNegocio(idNegocio:number, negocio:any){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/negocios/update/'+idNegocio,negocio)
  }

  updateParcialNegocio(idNegocio:number, parcialNegocio:any){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/negocios/parcial/'+idNegocio,parcialNegocio)
  }

  updatePhotos(idNegocio:number, arrayFotos:Array<string>){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/negocios/update/photos/'+idNegocio,{arrayFotos:arrayFotos})
  }

  deleteNegocio(idNegocio:number){
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/negocios/eliminar/'+idNegocio)
  }

  detail(idNegocio:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/negocios/detailed/'+idNegocio)
  }
}
