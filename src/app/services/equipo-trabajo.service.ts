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
  updateMiembroEquipo(id: number, miembro: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/integrantes/actualizar/' + id,
      miembro
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
