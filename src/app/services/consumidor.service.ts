import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class ConsumidorService {
  constructor(private https: HttpsService,) {}

  getMisConsumos(year: number, month: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/usuario/misconsumos',
      { year: year, month: month }
    );
  }

  updateConsumo(arrayConsumos: any, year: number, month: number) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/usuario/update/misconsumos',
      { arrayConsumos: arrayConsumos, year: year, month: month }
    );
  }

  getConsumosMunicipios() {
    return this.https.get(
      environment.doryApiRestBaseUrl +
        '/municipios/consumo/especies/total/nuevo'
    );
  }
  getConsumosDepartamento(idDpto: number, year: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl +
        '/municipios/consumo/especies/departamento',
      { idDepartamento: idDpto, year: year }
    );
  }
  getConsumidoresAll() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/usuario/consumidores/todos'
    );
  }
}
