import { Injectable } from '@angular/core';
import { HttpsService } from 'src/app/services/https.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PiscicultoresService {
  constructor(private https: HttpsService) {}

  getPiscicultoresAsociacion(idAsociacion: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl +
        '/piscicultores/asociacion/' +
        idAsociacion
    );
  }

  getPiscicultores() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/piscicultores/todos'
    );
  }

  getPiscicultoresMunicipio(idMunicipio: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/piscicultores/municipio/' + idMunicipio
    );
  }

  getPiscicultoresDepartamento(idDpto: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/piscicultores/departamento/' + idDpto
    );
  }
  getPiscicultorDetalle(id: number) {
    return this.https.get(environment.doryApiRestBaseUrl + '/usuario/id/' + id);
  }
  getPiscicultorDetalleGranjas(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/granjas/user/' + id
    );
  }


  getAsociacionesUsuario(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/asociaciones/usuario/' + id
    );
  }
  getAsociacionesIsMiembroUser(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/asociaciones/miembros/' + id
    );
  }
  esFavorita(id: number) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/granjas/esfavorita/' + id,
      null
    );
  }
  getPiscicultorPorAsociacion(nit: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/piscicultores/asociacion/' + nit
    );
  }
  getPiscicultoresEstadoSolicitud(nit: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/usuario/piscicultor/asociacion/' + nit
    );
  }
}
