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
import { GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    PoliticaComponent,
    CondicionesComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    RegistroModule,
    NgbModule,
    NgxSpinnerModule,
    SocialLoginModule
  ],
  providers: [
    HttpsService,
    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: true, //keeps the user signed in
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('534130932792-ejgt03avjabc24j3h5jbtp5m7urpqvr6.apps.googleusercontent.com') // your client id
        }
      ]
    }
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
