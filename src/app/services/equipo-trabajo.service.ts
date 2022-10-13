import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class EquipoTrabajoService {
  constructor(private https: HttpsService) {}
  getMiembrosEquipo() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/integrantes/obtener/'
    );
  }
  getConocenos() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/conocenos/obtener/'
    );
  }
  updateConocenos(id: number, dato: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/conocenos/actualizar/' + id,
      dato
    );
  }
  updateMiembroEquipo(id: number, miembro: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/integrantes/actualizar/' + id,
      miembro
    );
  }

  updateMiembroEquipoEnlaces(id: number, enlances: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/integrantes/actualizar/enlaces/' + id,
      enlances
    );
  }
  addMiembroEquipo(miembro: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/integrantes/registrar/',
      miembro
    );
  }
  deleteMiembroEquipo(idMiembro: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl + '/integrantes/eliminar/' + idMiembro
    );
  }
}
