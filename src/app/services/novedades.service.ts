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

  addView(idNovedad:number){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/novedades/visitas/'+idNovedad,null)
  }

  like(idNovedad:number){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/novedades/auth/like/'+idNovedad,null)
  }

  dislike(idNovedad:number){
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/novedades/auth/dislike/'+idNovedad)
  }
}
