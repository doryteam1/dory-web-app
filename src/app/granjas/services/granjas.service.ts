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

  deleteGranja(idGranja:number){
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/granjas/eliminar/'+idGranja)
  }

  updateGranja(id:number,updatedGranja:any){
    return this.https.put("https://dory-api-rest.herokuapp.com/api/granjas/general/"+id,updatedGranja);
  }

  getInfraestructuras(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/infraestructuras')
  }

  getEspecies(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/especies')
  }

  getGranjaDetalle(id:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/granjas/detailed/'+id)
  }
  updateParcial(id:number,datos:any){
     return this.https.put("https://dory-api-rest.herokuapp.com/api/granjas/parcial/"+id,datos);
  }
}
