import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TopAlertNotifyService } from 'src/app/services/top-alert-notify.service';
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
export class NotificationBarComponent implements OnInit{
  hasAlert: boolean = true;
  @HostBinding('hidden')
  isHidden: boolean = false;
  htmlContent: any = '';
  color: string = '#000000';
  toggle: boolean = false;
  onPublicar: number = 0;
  publicacion!: alert;
  constructor(
    private router: Router,
    private topAlertNotifyService: TopAlertNotifyService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route: string = event.url;
        if (
          route.includes('dashboard') ||
          route.includes('contacto') ||
          route.includes('update-password') ||
          route.includes('update-password') ||
          route.includes('login') ||
          route.includes('registro') ||
          route.includes('pescadores') ||
          route.includes('granjas') ||
          route.includes('piscicultores') ||
          route.includes('panel-busqueda') ||
          route.includes('proveedores/producto/detalle') ||
          route.includes('politica') ||
          route.includes('manual')
        ) {
          this.isHidden = true;
        } else {
          this.isHidden = false;
        }
      }
    });
    this.cargaService();
  }

  cargaService() {
    this.topAlertNotifyService.getTopAlert().subscribe(
      (response) => {
        console.log(response);
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
