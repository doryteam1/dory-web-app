import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private https:HttpsService) { }

  getCursosByString(text:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/evento/curso/'+text)
  }

  getCongresosByString(text:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/evento/congreso/'+text)
  }

  getCapacitacionesByString(text:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/evento/capacitacion/'+text)
  }

  getEventoByTipo(text:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/evento/tipo/'+text)
  }
}
