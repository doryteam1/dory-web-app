import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class TopAlertNotifyService {
  constructor(private https: HttpsService) {}
  getTopAlert() {
    return this.https.get(environment.doryApiRestBaseUrl + '/topalert/');
  }

  updateTopAlert(alert: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/topalert/',alert
    );
  }
  updateParcialTopAlert(alert: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/topalert/parcial/',
      alert
    );
  }
}
