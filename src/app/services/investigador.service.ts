import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class InvestigadorService {

  constructor(private httpService:HttpsService) { }

  getInvestigadoresAll(){
    return this.httpService.get(environment.doryApiRestBaseUrl+'/usuario/investigadores/todos')
  }
}
