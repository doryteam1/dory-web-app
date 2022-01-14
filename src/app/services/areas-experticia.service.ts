import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class AreasExperticiaService {

  constructor(private https:HttpsService) { }

  getAreasDeExperticia(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/areas-experticias');
  }
}
