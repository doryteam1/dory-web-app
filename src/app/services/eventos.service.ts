import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  constructor(private https: HttpsService) {}

  getCursosByString(text: string) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/buscar/evento/curso/' + text
    );
  }

  getCongresosByString(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/eventos/congresos/buscar'+text)
  }

  getCapacitacionesByString(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/eventos/capacitaciones/buscar/'+text)
  }

  getEventoByTipo(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/eventos/tipos/buscar/'+text)
  }

  getEventos() {
    return this.https.get(environment.doryApiRestBaseUrl + '/eventos/todos/');
  }
  updateEvento(id: number, evento:any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/eventos/' + id,
      evento
    );
  }
  updateEventoParcial(id: number, evento:any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/eventos/update/parcial/evento/' + id,
      evento
    );
  }

  addEvento(evento: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/eventos/',
      evento
    );
  }
  deleteEvento(idEvento: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl + '/eventos/' + idEvento
    );
  }
}
