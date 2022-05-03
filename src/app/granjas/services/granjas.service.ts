import { Injectable } from '@angular/core';
import { HttpsService } from 'src/app/services/https.service';

@Injectable({
  providedIn: 'root'
})
export class GranjasService {

  constructor(private https:HttpsService) {

  }

  getGranjas(){
    return this.https.get("https://dory-api-rest.herokuapp.com/granjas");
  }

  getGranjasMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/granjas/municipio/"+idMunicipio);
  }

  getGranja(id:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/granja/"+id);
  }

  getInformeGranjasPorDepartamento(){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/granjas/departamento");
  }

  addGranja(newGranja:any){
    return this.https.post('//dory-api-rest.herokuapp.com/api/granjas/',newGranja)
  }

  getGranjaByUserId(userId:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/granjas/user/'+userId)
  }

  anularGranja(idGranja:number){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/granjas/anular/'+idGranja, null)
  }

  updateGranja(id:number,updatedGranja:any){
    return this.https.put("https://dory-api-rest.herokuapp.com/api/granjas/general/"+id,updatedGranja);
  }
}
