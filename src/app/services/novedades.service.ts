import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class NovedadesService {

  constructor(private https:HttpsService) {

  }

  getNovedadesByString(text:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/buscar/novedad/'+text);
  }

  getNovedadesByTipo(tipo:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/buscar/novedad/tipo/'+tipo);
  }

  getNovedadesByTipoCadena(tipo:string, cadena:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/buscar/novedad/'+tipo+'/'+cadena);
  }

  addView(idNovedad:number){
    return this.https.put(environment.doryApiRestBaseUrl+'/novedades/visitas/'+idNovedad,null)
  }

  like(idNovedad:number){
    return this.https.post(environment.doryApiRestBaseUrl+'/novedades/auth/like/'+idNovedad,null)
  }

  dislike(idNovedad:number){
    return this.https.delete(environment.doryApiRestBaseUrl+'/novedades/auth/dislike/'+idNovedad)
  }
}
