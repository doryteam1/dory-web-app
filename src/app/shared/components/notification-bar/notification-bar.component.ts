import { Component, HostBinding,OnDestroy,OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { TopAlertNotifyService } from 'src/app/services/top-alert-notify.service';
import { UrlActualService } from 'src/app/services/url-actual.service';
interface alert {
  texto: string;
  status: number;
  color: any;
}

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss'],
})
export class NotificationBarComponent implements OnInit, OnDestroy {
  hasAlert: boolean = true;
  @HostBinding('hidden')
  isHidden: boolean = false;
  htmlContent: any = '';
  color: string = '#000000';
  toggle: boolean = false;
  onPublicar: number = 0;
  publicacion!: alert;
  urlActualSusc!: Subscription;

  hiddenRoutes:string[] = [
    'dashboard',
    'contacto',
    'update-password',
    'login',
    'registro',
    'pescadores',
    'granjas',
    'piscicultores',
    'panel-busqueda',
    'proveedores/producto/detalle',
    'politica',
    'manual',
  ];
  constructor(
    private topAlertNotifyService: TopAlertNotifyService,
    private urlActualService: UrlActualService
  ) {}

  ngOnInit(): void {
    this.urlActualSusc = this.urlActualService.currentUrl$.subscribe(
      (route) => {
        if (route) {
          this.isHidden = this.hiddenRoutes.some((hiddenRoute) =>route?.includes(hiddenRoute));
        } else {
          this.isHidden = true;
        }
      }
    );
    this.cargaService();
  }
  ngOnDestroy(): void {
    this.urlActualSusc.unsubscribe();
  }
  cargaService() {
    this.topAlertNotifyService.getTopAlert().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.publicacion = response.data[0];
          this.onPublicar = this.publicacion.status;
          if (this.publicacion.texto) {
            this.htmlContent = this.publicacion.texto;
          }
          if (this.publicacion.color) {
            this.color = this.publicacion.color;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeAlertState() {
    this.hasAlert = !this.hasAlert;
  }
}
