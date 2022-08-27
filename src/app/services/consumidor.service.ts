import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumidorService {

  constructor(private https:HttpsService) {

  }

  getMisConsumos(){
    return this.https.get(environment.doryApiRestBaseUrl+'/usuario/misconsumos')
  }

  updateConsumo(arrayConsumos:any){
    return this.https.put(environment.doryApiRestBaseUrl+'/usuario/update/misconsumos',{arrayConsumos:arrayConsumos})
  }
}
