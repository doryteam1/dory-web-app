import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  constructor(private https:HttpsService) { }

  getPublicacionesByUser(id:number){
    return this.https.get(
      environment.doryApiRestBaseUrl + '/publicaciones/usuario/' + id
    );
  }
}
