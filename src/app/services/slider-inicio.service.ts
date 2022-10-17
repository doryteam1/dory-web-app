import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class SliderInicioService {
  constructor(private https: HttpsService) {}
  getSliders() {
    return this.https.get(environment.doryApiRestBaseUrl + '/slider/obtener/');
  }
  addSlide(slide: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/slider/crear/',
      slide
    );
  }

  updateSlide(idslide: number, slide: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/slider/actualizar/' + idslide,
      slide
    );

  }

  updateParcialSlide(idslide: number, parcialslide: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/slider/update/parcial/slide/' +
        idslide,
        parcialslide
    );
  }
  updateTiempoSlaid(time:number) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/slider/update/time/slider',{tiempo:time}
    );
  }
  deleteSlide(idslide: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl +
        '/slider/delete/slide/' +
        idslide
    );
  }
}
