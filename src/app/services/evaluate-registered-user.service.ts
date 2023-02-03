import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Utilities } from 'src/app/utilities/utilities';
import { AppModalService } from '../shared/services/app-modal.service';
import { ChatService } from './chat.service';
import { UsuarioService } from './usuario.service';
@Injectable({
  providedIn: 'root',
})
export class EvaluateRegisteredUserService {
  constructor(
    private chatService: ChatService,
    public userService: UsuarioService,
    private appModalService: AppModalService,
    public location2: PlatformLocation,
    private router: Router
  ) {}
  evaluateUser(idUser: any): boolean {
    let payload: any;
    let token = localStorage.getItem('token');
    if (token) {
      payload = Utilities?.parseJwt(token!).sub;
    }
    return idUser != payload;
  }
  sendMessageOpenChat(idUser: any, textsModalAlertSignu:string) {
    if (this.userService.isAuthenticated()) {
      this.chatService.openUser(idUser);
    } else {
      this.location2.onPopState(() => {
        this.appModalService.closeModalAlertSignu();
      });
      this.appModalService
        .modalAlertSignu(textsModalAlertSignu)
        .then((result: any) => {
          if (result == 'registrate') {
            this.router.navigate(['/registro']);
          } else if (result == 'ingresar') {
            this.router.navigate(['/login']);
          }
        })
        .catch((result) => {});
    }
  }
}
