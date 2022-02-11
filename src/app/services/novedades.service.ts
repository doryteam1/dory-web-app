import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class NovedadesService {

  constructor(private https:HttpsService) {

  }

  getNovedadesByString(text:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/novedad/'+text);
  }

  getNovedadesByTipo(tipo:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/novedad/tipo/'+tipo);
  }

  getNovedadesByTipoCadena(tipo:string, cadena:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/buscar/novedad/'+tipo+'/'+cadena);
  }
}
