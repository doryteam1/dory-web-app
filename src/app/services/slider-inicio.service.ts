import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class SliderInicioService {
  constructor(private https: HttpsService) {}
  getSliders() {
    return this.https.get(environment.doryApiRestBaseUrl + '/sliders/obtener/');
  }
  addSlide(slide: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl + '/sliders/crear/',
      slide
    );
  }

  updateSlide(idslide: number, slide: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/sliders/actualizar/' + idslide,
      slide
    );

  }

  updateParcialSlide(idslide: number, parcialslide: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl +
        '/sliders/update/parcial/slide/' +
        idslide,
        parcialslide
    );
  }
/*   updateParcialSlaid(idSlaid: number, parcialSlaid: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl + '/sliders/update/time/slider/' + idSlaid,
      parcialSlaid
    );
  } */
  deleteSlide(idslide: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl +
        '/sliders/delete/slide/' +
        idslide
    );
  }
}
