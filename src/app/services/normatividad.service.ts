import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class NormatividadService {
  constructor(private https: HttpsService) {}

  getNormatividadesByString(cadena: string) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/normatividad/buscar/' + cadena
    );
  }
  getNormatividadesAll() {
    return this.https.get(environment.doryApiRestBaseUrl + '/normatividades/');
  }
  addNormatividad(normatividad: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/normatividades/',
      normatividad
    );
  }

  updateNormatividad(idNormatividad: number, normatividad: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/normatividades/' + idNormatividad,
      normatividad
    );
  }
  deleteNormatividad(idNormatividad: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl + '/normatividades/' + idNormatividad
    );
  }
}
