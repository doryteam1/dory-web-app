import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class SearchIndexService {

  constructor(private https: HttpsService) { }

  getIndex() {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/search'
    );
  }
}
