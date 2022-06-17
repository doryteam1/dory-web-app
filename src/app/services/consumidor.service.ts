import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumidorService {

  constructor(private https:HttpsService) {

  }

  getMisConsumos(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/usuario/misconsumos')
  }

  updateConsumo(arrayConsumos:any){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/usuario/update/misconsumos',{arrayConsumos:arrayConsumos})
  }
}
