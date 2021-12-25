import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistroModule } from './registro/registro.module';
import { HttpsService } from './services/https.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { PoliticaComponent } from './components/politica/politica.component';
import { CondicionesComponent } from './components/condiciones/condiciones.component';

@NgModule({
  declarations: [
    AppComponent,
    PoliticaComponent,
    CondicionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RegistroModule,
    NgbModule,
    NgxSpinnerModule
  ],
  providers: [
    HttpsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
