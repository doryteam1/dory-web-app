import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class TransportadoresService {

  constructor(private httpsService:HttpsService) { }

  getTransportadoresAll(){
    return this.httpsService.get(environment.doryApiRestBaseUrl+'/usuario/transportadores/todos')
  }
}
