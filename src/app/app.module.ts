import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistroModule } from './registro/registro.module';
import { HttpsService } from './services/https.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { PoliticaComponent } from './components/politica/politica.component';
import { CondicionesComponent } from './components/condiciones/condiciones.component';
import { GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ShareButtonsConfig } from 'ngx-sharebuttons';
import { ChatModule } from './chat/chat.module';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { NoSanitizePipe } from './pipes/noSanitize.pipe';




const customConfig: ShareButtonsConfig = {
  include: ['whatsapp', 'email', 'copy'],
  exclude: [],
  theme: 'modern-light',
  gaTracking: true,
  prop: {
    whatsapp: {
      icon: ['fab', 'whatsapp'],
      text: 'Whatsapp',
    },
    email: {
      text: 'Correo',
    },
    copy: {
      text: 'Copiar link',
      data: {
        text: 'Copiar link',
        successText: 'Copiado',
      },
    },
  },
  /* https://github.com/MurhafSousli/ngx-sharebuttons/blob/master/projects/ngx-sharebuttons/src/lib/share.defaults.ts */
};
@NgModule({
  declarations: [
    AppComponent,
    PoliticaComponent,
    CondicionesComponent,
    WelcomeComponent,
    VerifyAccountComponent,
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
    SocialLoginModule,
    SharedModule,
    ShareButtonsModule.withConfig(customConfig),
    ShareIconsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    ChatModule,

  ],
  providers: [
    TitleCasePipe,
    DatePipe,
    DecimalPipe,
    NoSanitizePipe,
    HttpsService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.oAuthClientId), // your client id
          },
        ],
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
