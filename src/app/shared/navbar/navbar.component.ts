import { AfterViewInit, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import { ElectronjsService } from 'src/app/services/electronjs.service';
dayjs.extend(relativeTime);
require('dayjs/locale/es')
dayjs.locale('es')
import { ResizeObserver } from '@juggle/resize-observer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
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

  @ViewChild('notifies', { read: Element }) notifies!: Element;
  resizedObserver!: ResizeObserver;
  notifiesHeigth: number = 0;
  @HostBinding('hidden')
  isHidden: boolean = false;
  electronjs:boolean=false

  constructor(
    private router: Router,
    private userService: UsuarioService,
    private storageService: StorageService,
    private elRef: ElementRef,
    private ar: ActivatedRoute,
    private _electronService: ElectronjsService
  ) {}

  ngOnInit(): void {
   this.electronjs= this._electronService.ipcActivo
    this.photoUser = localStorage.getItem('photoUser')!;
    this.nomCom = localStorage.getItem('nomApell')!;
    this.storageService.store$.subscribe((response) => {
      this.photoUser = response.photoUser;
      this.nomCom = response.nomApell;
    });
    this.userService.solicitudesDeAsociaciones().subscribe((response) => {
      this.invitaciones = response.data;
    });

    this.userService
      .solicitudesParaAsociacionesRepresentante()
      .subscribe((response) => {
        this.invitacionesFromUsers = response.data;
      });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route: string = event.url;
        if (route.includes('welcome')) {
          this.isHidden = true;
        } else {
          this.isHidden = false;
        }
      }
    });
  }

  test() {
    setTimeout(() => {
      this.tests.push('test');
      this.test();
    }, 2000);
  }
  ngAfterViewInit() {
    console.log('ngAftterViewInit!');
    /*  console.log(this.notifies)
     const observer = new ResizeObserver((entries)=>{
      console.log(entries)
    })

    observer.observe(this.notifies) */
    //console.log(this.elRef.nativeElement.querySelector('.notify__menu'))
    const notifies = document.querySelector('.notify__menu')!;

    const ro = new ResizeObserver((entries, observer) => {
      if (this.notifiesHeigth < 356) {
        this.notifiesHeigth = entries[0].contentRect.height;
      }
      this.resizedObserver = observer;
      console.log('resizing!');
    });

    ro.observe(notifies); // Watch dimension changes on notifies ul
  }

  ngOnDestroy(): void {
    console.log('ng on destroy');
    //this.resizedObserver.disconnect();// Stop observing
  }
  onResize() {
    console.log('resize!');
  }
  onClick(event: any) {
    console.log(event);
  }

  login() {
    let isAuth = this.userService.isAuthenticated();

    if (isAuth) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/login');
    }
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

  authWith() {
    return this.userService.authenticatedWith();
  }
  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/home');
  }

  updatePassword() {
    this.router.navigateByUrl('update-password');
  }

  confirmarInvitacion(invitacion: any) {
    invitacion.message = 'Aceptaste la solicitud. Ya eres miembro.';
    this.userService.aceptarInvitacion(invitacion.id_solicitud).subscribe(
      (response) => {},
      (err) => {
        invitacion.message = undefined;
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
    dayjs.extend(relativeTime);
    return dayjs().toNow(true);
  }
}
