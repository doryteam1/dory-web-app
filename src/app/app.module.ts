import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistroModule } from './registro/registro.module';
import { HttpsService } from './services/https.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RegistroModule,
    NgbModule
  ],
  providers: [
    HttpsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
