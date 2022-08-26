import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class TransportadoresService {

  constructor(private httpsService:HttpsService) { }

  getTransportadoresAll(){
    return this.httpsService.get('https://dory-api-rest.herokuapp.com/api/usuario/transportadores/todos')
  }
}
