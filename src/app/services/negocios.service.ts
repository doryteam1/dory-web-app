import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class NegociosService {
  constructor(private https: HttpsService) {}

  getNegociosByUserId(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/negocios/usuario/' + id
    );
  }

  getNegociosAll() {
    return this.https.get(environment.doryApiRestBaseUrl + '/negocios/');
  }
  getComerciantesAll() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/usuario/comerciantes/todos'
    );
  }
  addNegocio(negocio: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/negocios',
      negocio
    );
  }

  updateNegocio(idNegocio: number, negocio: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/negocios/update/' + idNegocio,
      negocio
    );
  }

  updateParcialNegocio(idNegocio: number, parcialNegocio: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/negocios/parcial/' + idNegocio,
      parcialNegocio
    );
  }

  updatePhotos(idNegocio: number, arrayFotos: Array<string | SafeUrl>) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/negocios/update/photos/' + idNegocio,
      { arrayFotos: arrayFotos }
    );
  }

  deleteNegocio(idNegocio: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl + '/negocios/eliminar/' + idNegocio
    );
  }

  detail(idNegocio: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/negocios/detailed/' + idNegocio
    );
  }
}
