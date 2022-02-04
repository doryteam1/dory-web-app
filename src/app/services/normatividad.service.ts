import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class NormatividadService {

  constructor(private https:HttpsService) { }

  getNormatividadesByString(cadena:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/normatividad/'+cadena)
  }
}
