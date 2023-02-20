import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';
import { environment } from 'src/environments/environment';
import { SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  constructor(private https: HttpsService) {}
  getRespuestasPregunta(idPregunta: number) {
    return this.https.get(environment.doryApiRestBaseUrl + '/foros/obtener/respuestas/pregunta/' + idPregunta);
  }

  updateRespuesta(idRespuesta: number, updatedRespuesta: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/foros/actualizar/respuesta/' +
        idRespuesta,
      updatedRespuesta
    );
  }
  updateParcialRespuesta(idRespuesta: number, updatedRespuesta: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/foros/actualizar/parcial/respuesta/' +
        idRespuesta,
      updatedRespuesta
    );
  }
  addRespuesta(newRespuesta: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/foros/registrar/respuesta/',
      newRespuesta
    );
  }

  deleteRespuesta(idRespuesta: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl +
        '/foros/eliminar/respuesta/' +
        idRespuesta
    );
  }

  updatePhotosRespuesta(idRespuesta: number, arrayFotos: Array<string | SafeUrl>) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/foros/actualizar/fotos/respuesta/' +
        idRespuesta,
      { arrayFotos: arrayFotos }
    );
  }
  updatePhotos(idPregunta: number, arrayFotos: Array<string | SafeUrl>) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/foros/actualizar/fotos/pregunta/' +
        idPregunta,
      { arrayFotos: arrayFotos }
    );
  }

  getPreguntasByUser(idUsuario: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl +
        '/foros/obtener/preguntas/usuario/' +
        idUsuario
    );
  }
  getPreguntasTodas() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/foros/obtener/todas/preguntas/'
    );
  }
  getPreguntaDetalles(idPregunta: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/foros/detalle/pregunta/' + idPregunta
    );
  }

  updatePregunta(idPregunta: number, updatedPregunta: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/foros/actualizar/pregunta/' +
        idPregunta,
      updatedPregunta
    );
  }

  addPregunta(newPregunta: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/foros/registrar/pregunta/',
      newPregunta
    );
  }

  deletePregunta(idPregunta: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl + '/foros/eliminar/pregunta/' + idPregunta
    );
  }
}
