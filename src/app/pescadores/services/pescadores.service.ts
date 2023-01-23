import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PescadoresService {
  constructor(private https: HttpClient) {}

  getPescadores() {
    return this.https.get(environment.doryApiRestBaseUrl + '/pescadores/todos');
  }

  getPescadoresMunicipio(idMunicipio: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/pescadores/municipio/' + idMunicipio
    );
  }

  getPescadoresAsociacion(idAsociacion: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/pescadores/asociacion/' + idAsociacion
    );
  }

  getPescadoresDepartamento(idDpto: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/pescadores/departamento/' + idDpto
    );
  }

  getPescadoresEstadoSolicitud(nit: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/usuario/pescador/asociacion/' + nit
    );
  }
  getPescadoresPorAsociacion(nit: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/pescadores/asociacion/' + nit
    );
  }

  /* sin terminar */
  getPescadorDetalle(id: number) {
    return this.https.get(environment.doryApiRestBaseUrl + '/usuario/id/' + id);
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
}

