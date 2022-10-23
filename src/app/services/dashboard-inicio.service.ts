import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardInicioService {
  constructor(private https: HttpsService) {}

  getDatosLenght() {
    return this.https.get(environment.doryApiRestBaseUrl + '/dashboard');
  }
}
