import {
  Component,
  OnInit,
  HostListener,
  Input,
  ElementRef,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { UrlActualService } from 'src/app/services/url-actual.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-floating-btn-auto-up',
  templateUrl: './floating-btn-auto-up.component.html',
  styleUrls: ['./floating-btn-auto-up.component.scss'],
})
export class FloatingBtnAutoUpComponent implements OnInit,OnDestroy {
  @HostBinding('hidden')
  isHidden: boolean = true;
  @Input() parentContainer: ElementRef | undefined;
  windowScrolled: boolean | undefined;
  urlActualSusc2!: Subscription;
  routesToShow: any = [
    '/geolocalizacion/asociaciones',
    '/novedades/',
    '/eventos/',
    '/normatividad/',
    '/equipo',
    '/nosotros',
    '/geolocalizacion/pescadores',
    '/geolocalizacion/granjas',
    '/geolocalizacion/piscicultores',
    '/dashboard/mis-favoritos',
    '/home',
    '/panel-busqueda/productos',
    '/panel-busqueda/vehiculos',
    '/panel-busqueda/negocios',
    '/dashboard/granja/detalle',
    '/pescadores/municipio/',
    '/granjas/municipio/',
    '/piscicultores/municipio/',
    '/asociaciones/municipio/',
    'dashboard/granjas',
    'panel-busqueda/asociaciones',
    'panel-busqueda/pescadores',
    'panel-busqueda/piscicultores',
    'panel-busqueda/granjas',
    '/welcome',
    '/dashboard/equipo-trabajo-admi',
    '/pescadores/municipio',
    '/granjas/municipio',
    '/piscicultores/municipio',
    '/asociaciones/municipio',
    '/grupo-asociaciones',
  ];
  isAuthUser: boolean = false;
  constructor(
    public userService: UsuarioService,
    private urlActualService: UrlActualService
  ) {}
  ngOnDestroy(): void {
    this.urlActualSusc2.unsubscribe()
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 200
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }
  scrollToBottom(): void {
    (function smoothscroll() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    })();
  }

  onScrollContainer(scrollTop: number) {
    if (scrollTop || scrollTop > 100) {
      this.windowScrolled = true;
    } else if (scrollTop || scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToBottomContainer(): void {
    this.parentContainer!.nativeElement!.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

  restartScroll() {
    if (!this.parentContainer) {
      this.scrollToBottom();
    } else {
      this.scrollToBottomContainer();
    }
  }

  ngOnInit(): void {
    this.isAuthUser = this.userService.isAuthenticated();
    this.userService.getAuthObservable().subscribe((isAuth) => {
      this.isAuthUser = isAuth;
    });
  this.urlActualSusc2 = this.urlActualService.currentUrl$.subscribe(
      (route) => {
      let resultShow: boolean = this.routesToShow.some((element: any) =>route?.includes(element));
      this.isHidden = !resultShow;
      })
  }
}
