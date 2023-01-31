import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { AppModalService } from '../services/app-modal.service';
import { ChatService } from 'src/app/services/chat.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Utilities } from 'src/app/utilities/utilities';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { Subscription } from 'rxjs/internal/Subscription';
declare var window: any;
@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss'],
})
export class ControlBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('notifies', { read: Element }) notifies!: Element;
  @ViewChild('miModalNotificacion') miModalNotificacion!: ElementRef;
  @ViewChild('dropdownNotificacion')
  dropdownNotificacion!: ElementRef<HTMLElement>;
  @ViewChild('buttonOpenModalNotify') buttonOpenModalNotify!: ElementRef;
  @ViewChild('navbar') navbar!: ElementRef;
  photoUser: string = '';
  nomCom: string = '';
  successMessage = 'Mensaje de prueba';
  invitaciones: Array<any> = [];
  notificatiosOpened: boolean = false;
  invitacionesFromUsers: Array<any> = [];
  tests: string[] = [];
  rutaActiva: string = '';
  formModal: any;
  isHidden: boolean = false;
  electronjs: boolean = false;
  currentRoute: string = '';
  responsibe: boolean = false;
  mediaQuerySubscripNavbar!: Subscription;
  constructor(
    private _electronService: ElectronjsService,
    private ngZone: NgZone,
    private router: Router,
    public userService: UsuarioService,
    private storageService: StorageService,
    private renderer: Renderer2,
    private appModalService: AppModalService,
    private chatService: ChatService,
    private utilities: UtilitiesService,
    private asociacionesService: AsociacionesService,
    public mediaQueryService: MediaQueryService
  ) {
    /* Escucha los eventos de clic de la pantalla */
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.miModalNotificacion?.nativeElement.className.includes('show')) {
        if (
          this.navbar?.nativeElement.contains(e.target) &&
          !this.buttonOpenModalNotify?.nativeElement.contains(e.target)
        ) {
          this.closeModalNotificacion();
        }
      }
    });
  }

  ngOnInit(): void {
    this.electronjs = this._electronService.ipcActivo;
    this.photoUser = localStorage.getItem('photoUser')!;
    this.nomCom = localStorage.getItem('nomApell')!;
    this.storageService.store$.subscribe((response) => {
      this.photoUser = response.photoUser;
      this.nomCom = response.nomApell;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route: string = event.url;
        this.rutaActiva = event.url;
        this.currentRoute = event.url;
        if (route.includes('welcome') || route.includes('politica')) {
          this.isHidden = true;
        } else {
          this.isHidden = false;
        }
      }
    });
    if (this.userService.isAuthenticated()) {
      this.updateAsocRequest();
    }
    this.chatService.listenNewSolicitudes().subscribe((data) => {
      this.notificatiosOpened = false;
      this.utilities.playSound('assets/sounds/sendmessage.wav');
      this.updateAsocRequest();
    });
    /* https://www.learmoreseekmore.com/2022/01/usage-of-bootstrap-v5-modal-in-angularv13.html */
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('ModalNotificacion'),
      {
        backdrop: true,
      }
    );
    /* Se dispara cuando la pantalla es menor o igual a 1000px */
    this.mediaQuerySubscripNavbar = this.mediaQueryService
      .mediaQuery('max-width: 520px')
      .subscribe((matches) => {
        if (matches) {
          this.responsibe = true;
          if (
            this.dropdownNotificacion?.nativeElement.className.includes('show')
          ) {
            this.dropdownNotificacion?.nativeElement.click();
          }
        } else {
          if (
            this.miModalNotificacion?.nativeElement.className.includes('show')
          ) {
            this.closeModalNotificacion();
          }
          this.responsibe = false;
        }
      });
  }
  handleNotificationClick() {
    if (this.responsibe) {
      if (this.miModalNotificacion?.nativeElement.className.includes('show')) {
        this.closeModalNotificacion();
      } else {
        this.notificatiosOpened = true;
        this.openFormModal();
      }
    } else {
      this.notificatiosOpened = true;
    }
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

  updateAsocRequest() {
    this.userService.solicitudesDeAsociaciones().subscribe((response) => {
      this.invitaciones = response.data;
    });

    this.userService
      .solicitudesParaAsociacionesRepresentante()
      .subscribe((response) => {
        this.invitacionesFromUsers = response.data;
      });
  }

  test() {
    setTimeout(() => {
      this.tests.push('test');
      this.test();
    }, 2000);
  }
  ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.mediaQuerySubscripNavbar.unsubscribe();
    //this.resizedObserver.disconnect();// Stop observing
  }

  login() {
    this.ngZone.run(() => {
      this.router.navigateByUrl(
        this.userService.isAuthenticated() ? '/dashboard' : '/login'
      );
    });
  }
  authenticated() {
    return this.userService.isAuthenticated();
  }

  authUserPhoto(): any {
    return this.userService.getAuthUserPhoto();
  }

  authUserNomApell(): any {
    return this.userService.getAuthUserNomApell();
  }
  authUserTipo_usuario(): any {
    return this.userService.getAuthUserTipo_usuario();
  }
  authWith() {
    return this.userService.authenticatedWith();
  }
  logout() {
    this.ngZone.run(() => {
      if (
        this.authWith() == 'email' ||
        (this.authWith() == 'google' && !this.electronjs)
      ) {
        this.userService?.logout();
      }
      if (this.authWith() == 'google' && this.electronjs) {
        this.userService.logoutElectron();
      }
      this.router.navigateByUrl('/home');
    });
  }

  updatePassword() {
    this.ngZone.run(() => {
      this.router.navigateByUrl('dashboard/update-password');
    });
  }

  confirmarInvitacion(invitacion: any) {
    invitacion.message = 'Aceptaste la solicitud. Ya eres miembro.';
    this.userService.aceptarInvitacion(invitacion.id_solicitud).subscribe(
      (response) => {
        if (this.rutaActiva.includes('/dashboard/mis-asociaciones')) {
          this.asociacionesService.actionBotton$.emit(true);
        }
      },
      (err) => {
        if (this.rutaActiva.includes('/dashboard/mis-asociaciones')) {
          this.asociacionesService.actionBotton$.emit(false);
        }
        invitacion.error = err.error.message;
        invitacion.message = undefined;
        setTimeout(() => {
          invitacion.error = '';
        }, 5000);
      }
    );
  }
  eliminarInvitacion(invitacion: any) {
    invitacion.message = 'Solicitud eliminada';
    this.userService.eliminarSolicitud(invitacion.id_solicitud).subscribe(
      (response) => {

      },
      (err) => {
        console.log(err);
        invitacion.message = undefined;
      }
    );
  }

  timeToNow(date: string) {
    return Utilities.dateFromX(date);
  }
  search() {
    this.appModalService
      .modalSearchComponentl()
      .then((result) => {})
      .catch((result) => {});
  }
  navegarRuta(ruta: string) {
    this.ngZone.run(() => {
      this.router.navigateByUrl(ruta);
    });
  }
  /* Electron */
  openFormModal() {
    this.formModal.show();
  }
  closeModalNotificacion() {
    this.formModal.hide();
  }
}
