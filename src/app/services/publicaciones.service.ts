import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  constructor(private https: HttpsService) {}

  getPublicacionesByUser(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/publicaciones/usuario/' + id
    );
  }

  getPublicacionesTodas() {
    return this.https.get(environment.doryApiRestBaseUrl + '/publicaciones/');
  }

  updatePhotos(id: number, newPhotos: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/publicaciones/update/photos/' + id,
      newPhotos
    );
  }

  updatePublicacion(id: number, updatedPublicacion: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/publicaciones/update/' + id,
      updatedPublicacion
    );
  }

  addPublicacion(newPublicacion: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/publicaciones/',
      newPublicacion
    );
  }
  deletePublicacion(idPublicacion: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl +
        '/publicaciones/eliminar/' +
        idPublicacion
    );
  }
  getPublicacionDetail(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/publicaciones/detailed/' + id
    );
  }
}
