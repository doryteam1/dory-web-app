import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { ResizeObserver } from '@juggle/resize-observer';
import { AppModalService } from '../services/app-modal.service';
import { ChatService } from 'src/app/services/chat.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Utilities } from 'src/app/utilities/utilities';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';

declare var window: any;
@Component({
  selector: 'app-navbar-electronjs',
  templateUrl: './navbar-electronjs.component.html',
  styleUrls: ['./navbar-electronjs.component.scss'],
})
export class NavbarElectronjsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('botonalbondiga') botonalbondiga!: ElementRef;
  @ViewChild('notifies', { read: Element }) notifies!: Element;
  @ViewChild('miModalNotificacion')
  miModalNotificacion!: ElementRef;
  @ViewChild('dropdownNotificacion')
  dropdownNotificacion!: ElementRef<HTMLElement>;
  @ViewChild('notifyModalDropdown')
  notifyModalDropdown!: ElementRef<HTMLElement>;
  @ViewChild('toggleButton2') toggleButton2!: ElementRef;
  @ViewChild('miModalNotificacionContent')
  miModalNotificacionContent!: ElementRef;
  @ViewChild('buttonOpenModalNotify')
  buttonOpenModalNotify!: ElementRef;
  photoUser: string = '';
  nomCom: string = '';
  successMessage = 'Mensaje de prueba';
  invitaciones: Array<any> = [];
  notificatiosOpened: boolean = false;
  invitacionesFromUsers: Array<any> = [];
  notifyHeights: string[] = [
    '',
    'notify__menu--height1',
    'notify__menu--height2',
    'notify__menu--height3',
    'notify__menu--height4',
    'notify__menu--height5',
    'notify__menu--height6',
    'notify__menu--height7',
  ];
  tests: string[] = [];
  resizedObserver!: ResizeObserver;
  notifiesHeigth: number = 0;
  @HostBinding('hidden')
  notifyStyloContainer: boolean = false;
  rutaActiva: string = '';
  /* Propios para electron */
  formModal: any;
  ocultarHtml: boolean = false;
  isHidden: boolean = false;
  electronjs: boolean = false;
  currentRoute: string = '';
  showMenu: boolean = false;
  /* Fin */
  constructor(
    private router: Router,
    public userService: UsuarioService,
    private storageService: StorageService,
    private _electronService: ElectronjsService,
    private renderer: Renderer2,
    private appModalService: AppModalService,
    private chatService: ChatService,
    private utilities: UtilitiesService,
    private asociacionesService: AsociacionesService,
    private ngZone: NgZone
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        !this.toggleButton?.nativeElement.contains(e.target) &&
        !this.botonalbondiga?.nativeElement.contains(e.target)
      ) {
        /* https://www.wake-up-neo.net/es/html/como-detectar-el-clic-fuera-de-un-elemento-en-angular-7/806431830/ */
        this.renderer.removeClass(this.toggleButton2?.nativeElement, 'show');
      }
      if (this.miModalNotificacion?.nativeElement.className.includes('show')) {
        if (
          !this.miModalNotificacionContent?.nativeElement.contains(e.target) &&
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
        backdrop: false,
      }
    );
  }
  @HostListener('window:resize', ['$event']) mediaScreen(event: any) {
    if (event.target.innerWidth >= 1373) {
      if (this.miModalNotificacion?.nativeElement.className.includes('show')) {
        this.closeModalNotificacion();
      }
    } else if (event.target.innerWidth <= 1373) {
      if (this.dropdownNotificacion?.nativeElement.className.includes('show')) {
        this.dropdownNotificacion?.nativeElement.click();
      }
    }
    if (event.target.innerWidth >= 450) {
      if (this.notifyModalDropdown?.nativeElement.className.includes('show')) {
        this.notifyModalDropdown?.nativeElement.click();
      }
    }
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
  ngAfterViewInit() {
    const notifies = document.querySelector('.notify__menu')!;
    const ro = new ResizeObserver((entries, observer) => {
      if (this.notifiesHeigth < 356) {
        this.notifiesHeigth = entries[0].contentRect.height;
      }
      this.resizedObserver = observer;
    });

    ro.observe(notifies); // Watch dimension changes on notifies ul
  }

  ngOnDestroy(): void {
    console.log('ng on destroy');
    //this.resizedObserver.disconnect();// Stop observing
  }

  login() {
    this.ngZone.run(() => {
      this.renderer.removeClass(this.toggleButton2.nativeElement, 'show');
      let isAuth = this.userService.isAuthenticated();
      if (isAuth) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/login');
      }
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
      this.renderer.removeClass(this.toggleButton2.nativeElement, 'show');
      this.userService.logoutElectron();
      this.router.navigateByUrl('/home');
    });
  }

  updatePassword() {
    this.ngZone.run(() => {
      this.renderer.removeClass(this.toggleButton2.nativeElement, 'show');
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
        console.log(response);
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
      this.renderer.removeClass(this.toggleButton2.nativeElement, 'show');
    });
  }
  /* Electron */
  openFormModal() {
    this.formModal.show();
  }
  closeModalNotificacion() {
    this.formModal.hide();
  }
  /* fin */
}
