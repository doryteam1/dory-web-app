import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  constructor(private https:HttpsService) { }

  getEspecies(){
    return this.https.get(environment.doryApiRestBaseUrl+'/especies')
  }
}
