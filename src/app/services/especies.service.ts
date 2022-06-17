import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  constructor(private https:HttpsService) { }

  getEspecies(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/especies')
  }
}
