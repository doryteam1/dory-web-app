import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private url = environment.doryServerUrl;

  constructor(private userService:UsuarioService) {
    this.socket = io(this.url, {
      transports: ['websocket', 'polling', 'flashsocket'],
      auth: {
        token: "Bearer " + this.userService.getAuthUserToken()!
      }
    });
  }

  joinRoom(data: any): void {
    this.socket.emit('join', data);
  }

  sendMessage(data: {uid:string, mensaje:string}): void {
    this.socket.emit('new-message', data);
  }

  getMessage(): Observable<any> {
    return new Observable<{ user: any; message: string }>((observer) => {
      this.socket.on('new-message', (data) => {
        console.log(data);
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
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
}
