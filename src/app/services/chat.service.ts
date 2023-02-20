import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
import { UsuarioService } from './usuario.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: Socket;
  private url = environment.doryServerUrl;
  chatRefs: { btnChat: HTMLElement; userRefs: any } | null = null;
  subject: Subject<string> = new Subject<string>();
  constructor(
    private userService: UsuarioService,
    private https: HttpsService
  ) {
    this.connect();
  }

  joinRoom(data: any): void {
    this.socket.emit('join', data);
  }

  sendMessage(data: { uid: string; mensaje: string }): void {
    this.socket.emit('new-message', data);
  }

  requestLastConectedUsers(): void {
    this.socket.emit('usuarios-activos', null);
  }

  getMessage(): Observable<any> {
    return new Observable<{ de: number; mensaje: string; metadata: any }>(
      (observer) => {
        this.socket.on('new-message', (data) => {
          observer.next(data);
        });

        return () => {
          this.socket.disconnect();
        };
      }
    );
  }

  getConfirmMessage(): Observable<any> {
    return new Observable<{ de: number; mensaje: string; metadata: any }>(
      (observer) => {
        this.socket.on('confirmation-message', (data) => {
          observer.next(data);
        });

        return () => {
          this.socket.disconnect();
        };
      }
    );
  }

  getConectedUsers(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('usuarios-activos', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getLastUserConnected(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('ultimo-conectado', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getLastUserDisconnected(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('ultimo-desconectado', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getStorage() {
    const storage = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data: any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }

  getChatMessages(idUser: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl + '/chat/mensajes/privados/' + idUser
    );
  }

  getUltimosMensajes() {
    return this.https.get(environment.doryApiRestBaseUrl + '/chat/ultimos');
  }

  disconnect() {
    this.socket.disconnect();
  }

  connect() {
    this.socket = io(this.url, {
      transports: ['websocket', 'polling', 'flashsocket'],
      auth: {
        token: 'Bearer ' + this.userService.getAuthUserToken()!,
      },
    });
  }
  reset() {
    this.socket.connect()
  }
  isUserAuth() {
    if (!this.userService.isAuthenticated()) {
      this.disconnect();
      return false;
    } else {
      if (this.socket.disconnected) {
        //this.connect();
      }
      return true;
    }
  }

  setChatRefs(refs: { btnChat: HTMLElement; userRefs: any }) {
    this.chatRefs = refs;
  }

  openUser(userId: number) {
    console.log('open user');
    this.subject.next(JSON.stringify(userId));
    //this.chatRefs?.btnChat.click();
    //this.chatRefs.userRefs[userId].click();
  }

  getOpenChatUserObservable() {
    return this.subject.asObservable();
  }

  setReaded(idUsuarioEmisor: number) {
    return this.https.put(
      'https://dory-api-rest.herokuapp.com/api/chat/set/readed/all/' +
        idUsuarioEmisor,
      null
    );
  }

  /*Escucha si hay nuevas solicitudes de asociaciones --> usuario o usuario --> asociaciones*/
  listenNewSolicitudes(): Observable<any> {
    return new Observable<{ de: number; mensaje: string; metadata: any }>(
      (observer) => {
        this.socket.on('new-solicitud', (data) => {
          observer.next(data);
        });

        return () => {
          this.socket.disconnect();
        };
      }
    );
  }
}
