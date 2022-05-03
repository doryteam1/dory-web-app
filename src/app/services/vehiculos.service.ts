import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private https:HttpsService) { }

  getVehiculosUser(userId:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/vehiculos'+userId)
  }
}
