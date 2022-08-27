import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class AreasExperticiaService {

  constructor(private https:HttpsService) { }

  getAreasDeExperticia(){
    return this.https.get(environment.doryApiRestBaseUrl+'/areas-experticias');
  }
}
