import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private https:HttpsService) { }

  getCursosByString(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/buscar/evento/curso/'+text)
  }

  getCongresosByString(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/buscar/evento/congreso/'+text)
  }

  getCapacitacionesByString(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/buscar/evento/capacitacion/'+text)
  }

  getEventoByTipo(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/buscar/evento/tipo/'+text)
  }
}
