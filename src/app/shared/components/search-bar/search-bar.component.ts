import {
  Component,
  HostBinding,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ElectronjsService } from 'src/app/services/electronjs.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() onBotonAtrasAlante: EventEmitter<boolean> = new EventEmitter();
  BotonAtrasAlante: boolean = false;
  @HostBinding('hidden')
  isHidden: boolean = false;
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private location: Location,
    private _electronService: ElectronjsService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        let route: string = event.url;
        if (
          route.includes('dashboard') ||
          route.includes('contacto') ||
          route.includes('update-password') ||
          route.includes('update-password') ||
          route.includes('login') ||
          route.includes('registro') ||
          route.includes('panel-busqueda') ||
          route.includes('pescadores') ||
          route.includes('granjas') ||
          route.includes('piscicultores')
        ) {
          this.isHidden = true;
        } else {
          this.isHidden = false;
        }
      }
    });
    this.activatebutton();
  }
  activatebutton = (): void => {
    this._electronService?.send('activateButtonAngular', 'activar');
    this._electronService?.on(
      'activateButtonElectron',
      (event: any, arg: string) => {
        this.BotonAtrasAlante = arg === 'BotonActivado';
        this.onBotonAtrasAlante.emit(this.BotonAtrasAlante);
        this.cdRef.detectChanges();
      }
    );
  };
  goBack(): void {
    this.location.back();
  }

  getForward(): void {
    this.location.forward();
  }
  ngOnDestroy(): void {
    this._electronService.removeAllListeners(
      'activateButtonElectron'
    );
  }
}
