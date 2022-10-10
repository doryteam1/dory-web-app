import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MisionVisionService {
  constructor(private https: HttpsService) {}
  getVisionMision() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/nosotros/obtener/'
    );
  }
  updateVisionMision(id: number, misionVision: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/nosotros/actualizar/' + id,
      misionVision
    );
  }
}
