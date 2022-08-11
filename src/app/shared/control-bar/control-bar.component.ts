import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronjsService } from 'src/app/services/electronjs.service';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss'],
})
export class ControlBarComponent implements OnInit {
  constructor(
    private _electronService: ElectronjsService,
    private ngZone: NgZone,
    private router: Router,
  ) {

  }

  ngOnInit(): void {}
  navegarRuta(ruta: string) {
    this.ngZone.run(() => {
      this.router.navigateByUrl(ruta);
    });
  }
  buttonMin() {
    this._electronService?.send('min-button');
    this._electronService.removeAllListeners('min-button');
  }
  buttonMax() {
    this._electronService?.send('max-button');
    this._electronService.removeAllListeners('max-button');
  }
  buttonClose() {
    this._electronService?.send('close-button');
    this._electronService.removeAllListeners('close-button');
  }
}
