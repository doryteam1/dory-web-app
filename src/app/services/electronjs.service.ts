import { IpcRenderer } from 'electron';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ElectronjsService {
  private ipc!: IpcRenderer;
  constructor() {
    if (window.require) {
      try {
        this.ipc = window.require('electron').ipcRenderer;
        console.log('electron aqui');
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron IPC was not loaded');
    }
  }
  // Las funciones que hemos añadido, para ipcRenderer
  public on(channel: string, listener: any): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.on(channel, listener);
  }

  public once(channel: string, listener: any): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.once(channel, listener);
  }

  public send(channel: string, ...args: any[]): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.send(channel, ...args);
  }

  public removeAllListeners(channel: string): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.removeAllListeners(channel);
  }
}
/* https://www.sitepoint.com/build-a-desktop-application-with-electron-and-angular/ */
/* https://medium.com/dottech/creando-una-aplicaci%C3%B3n-de-escritorio-con-angular-y-electron-a151b40e11a6 */
/* https://github.com/ThorstenHans/ngx-electron/blob/master/projects/ngx-electron/src/lib/electron.service.ts */


