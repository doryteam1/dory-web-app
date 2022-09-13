import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class VehiculosService {
  constructor(private https: HttpsService) {}

  getVehiculosUser(userId: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/vehiculos/' + userId
    );
  }

  getVehiculosAll() {
    return this.https.get(environment.doryApiRestBaseUrl + '/vehiculos/');
  }

  addVehiculo(vehiculo: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/vehiculos',
      vehiculo
    );
  }

  updateVehiculo(vehiculo: any, id: number) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/vehiculos/' + id,
      vehiculo
    );
  }

  deleteVehiculo(id: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl + '/vehiculos/' + id
    );
  }

  getDetail(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/vehiculos/detailed/' + id
    );
  }
  updatePhotosVehiculos(id_vehiculo: number, photos: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/vehiculos/update/photos/' +
        id_vehiculo,
      photos
    );
  }
}
