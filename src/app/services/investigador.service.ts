import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class InvestigadorService {

  constructor(private httpService:HttpsService) { }

  getInvestigadoresAll(){
    return this.httpService.get('https://dory-api-rest.herokuapp.com/api/usuario/investigadores/todos')
  }
}
