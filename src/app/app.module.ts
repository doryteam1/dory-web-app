import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PiscicultoresComponent } from './piscicultores/components/piscicultores/piscicultores.component';
import { RegistroModule } from './registro/registro.module';
import { RegistroComponent } from './registro/components/registro/registro.component';

@NgModule({
  declarations: [
    AppComponent,
    PiscicultoresComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RegistroModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
