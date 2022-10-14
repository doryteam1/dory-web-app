import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
@Injectable({
  providedIn: 'root',
})
export class EnlacesDirectosInicioService {
  constructor(private https: HttpsService) {}
  getTodos() {
    return this.https.get(environment.doryApiRestBaseUrl + '/enlacesRapidos/obtener/');
  }
  add(enlaceDirect: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/enlacesRapidos/crear/',
      enlaceDirect
    );
  }

  update(id: number, enlaceDirect: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/enlacesRapidos/actualizar/' + id,
      enlaceDirect
    );
  }

  delete(idEnlaceDitect: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl +
        '/enlacesRapidos/eliminar/enlaceRapido/' +
        idEnlaceDitect
    );
  }
}
