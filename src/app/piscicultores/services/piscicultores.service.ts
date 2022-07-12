import { Injectable } from '@angular/core';
import { HttpsService } from 'src/app/services/https.service';

@Injectable({
  providedIn: 'root',
})
export class PiscicultoresService {
  constructor(private https: HttpsService) {}

  getPiscicultoresAsociacion(idAsociacion: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/piscicultores/asociacion/' +
        idAsociacion
    );
  }

  getPiscicultores() {
    return this.https.get('https://dory-api-rest.herokuapp.com/piscicultores');
  }

  getPiscicultoresMunicipio(idMunicipio: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/piscicultores/municipio/' +
        idMunicipio
    );
  }

  getPiscicultoresDepartamento(idDpto: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/piscicultores/departamento/' +
        idDpto
    );
  }
  getPiscicultorDetalle(id: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/usuario/id/' + id
    );
  }
  getPiscicultorDetalleGranjas(id: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/granjas/user/' + id
    );
  }
  getPiscicultorDetalleAsociaciones(id: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/asociaciones/usuario/' + id
    );
  }
  esFavorita(id: number) {
    return this.https.put(
      'https://dory-api-rest.herokuapp.com/api/granjas/esfavorita/' + id,
      null
    );
  }
  getPiscicultorPorAsociacion(nit: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/piscicultores/asociacion/' + nit
    );
  }
  getPiscicultoresEstadoSolicitud(nit: number) {
    return this.https.get(
      'https://dory-api-rest.herokuapp.com/api/usuario/piscicultor/asociacion/' +
        nit
    );
  }
}
