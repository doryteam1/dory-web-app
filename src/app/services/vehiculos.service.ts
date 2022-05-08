import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private https:HttpsService) { }

  getVehiculosUser(userId:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/vehiculos/'+userId)
  }

  addVehiculo(vehiculo:any){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/vehiculos',vehiculo)
  }

  updateVehiculo(vehiculo:any, id:number){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/vehiculos/'+id,vehiculo)
  }

  deleteVehiculo(id:number){
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/vehiculos/'+id)
  }
}
