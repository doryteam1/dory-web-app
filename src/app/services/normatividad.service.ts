import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class NormatividadService {

  constructor(private https:HttpsService) { }

  getNormatividadesByString(cadena:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/normatividad/buscar/'+cadena)
  }
}
