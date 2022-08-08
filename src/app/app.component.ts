import { Component } from '@angular/core';
import { ElectronjsService } from 'src/app/services/electronjs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'web-app-dory';
  isRegistering: boolean = false;
  activate: boolean = false;
  constructor(
    private _electronService: ElectronjsService
  ) {}
  exit(event: any) {
    console.log('exit app');
    this.isRegistering = false;
  }
  botonAtrasAlante(event: boolean) {
    this.activate = event
  }
buttonMin(){
this._electronService?.send('min-button');
this._electronService.removeAllListeners('min-button');
}
buttonMax(){
this._electronService?.send('max-button');
this._electronService.removeAllListeners('max-button');
}
buttonClose(){
this._electronService?.send('close-button');
this._electronService.removeAllListeners('close-button');
}

}
