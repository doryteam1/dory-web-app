import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';




// Función estática para cargar la API de Google Maps
/*  (window as any).initMap = () => {
  const script = document.createElement('script');
  script.src ='https://maps.googleapis.com/maps/api/js?key=' + environment.mapsApiKey+'&libraries=visualization'
  console.log(environment.mapsApiKey);
  document.head.appendChild(script);
};
 (window as any).initMap(); */
 // https://smaillns.medium.com/integrating-google-maps-in-angular-application-using-angular-google-maps-280a66c32c57

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
