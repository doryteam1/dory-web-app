import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FloatingBtnAutoUpComponent } from './shared/components/floating-btn-auto-up/floating-btn-auto-up.component';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { ChatService } from './services/chat.service';
import { UsuarioService } from './services/usuario.service';
import { NavigationEnd, Router } from '@angular/router';
import { CalcHeightNavbarService } from './services/calc-height-navbar.service';
import { Subscription } from 'rxjs';
import { UrlActualService } from './services/url-actual.service';

declare const process: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent
  implements
    OnInit,
    AfterViewInit,
    AfterContentChecked
{
  title = 'web-app-dory';
  isRegistering: boolean = false;
  customTitleBarElectron: boolean = false;
  @ViewChild(FloatingBtnAutoUpComponent)
  floatingBtn!: FloatingBtnAutoUpComponent;
  @ViewChild('main') divMain!: ElementRef;
  @ViewChild('navbarDiv') navbarDiv!: ElementRef;
  isAuthUser: boolean = false;
  show: boolean = false;
  height: any;

  rutasSusc!: Subscription;
  urlActual: string = '';

  constructor(
    private _electronService: ElectronjsService,
    public userService: UsuarioService,
    private chatService: ChatService,
    private router: Router,
    public calcHeightNavbarService: CalcHeightNavbarService,
    private urlActualService: UrlActualService,
  ) {}
  ngAfterContentChecked(): void {
   if (this.height !== this.navbarDiv?.nativeElement?.clientHeight) {
     this.height = this.navbarDiv?.nativeElement?.clientHeight;
     this.calcHeightNavbarService.updateData([
       `calc(100% - ${this.height}px)`,
       this.height,
     ]);
   }
  }




  ngAfterViewInit(): void {
    /* Obtenemos el primer dato de height */
    this.height = this.navbarDiv?.nativeElement?.clientHeight;
    this.calcHeightNavbarService.updateData([
      `calc(100% - ${this.height}px)`,
      this.height,
    ]);
  }

  ngOnInit(): void {
    this.isAuthUser = this.userService.isAuthenticated();
    this.customTitleBarElectron = this._electronService.ipcActivo;

    this.userService.getAuthObservable().subscribe((isAuth) => {
      this.isAuthUser = isAuth;
      if (!this.isAuthUser) {
        this.chatService.disconnect();
      }
    });

    this.rutasSusc = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.urlActual = event.url;
        this.urlActualService.setCurrentUrl(event.url);
        this.divMain?.nativeElement?.scroll(0, 0);
        if (!this.isAuthUser) {
          if (
            localStorage.getItem('urlPrevious') ||
            localStorage.getItem('urlPrevious-abort')
          ) {
            if (localStorage.getItem('urlPrevious') === '/welcome') {
              //Estvo dentro de /welcome
              localStorage.removeItem('urlPrevious');
              this.router.navigateByUrl('/abort-register');
              return;
            }

            if (
              localStorage.getItem('urlPrevious-abort') === '/abort-register' &&
              this.urlActual !== '/welcome' &&
              this.urlActual !== '/abort-register'
            ) {
              //Estuvo dentro /abort-register, ahora esta en url distanta  a /welcome o /abort-register
              this.userService.removeLocalStorage(true);
              return;
            }

            if (
              localStorage.getItem('urlPrevious-abort') === '/abort-register' &&
              this.urlActual === '/welcome'
            ) {
              //Está dentro de /welcome y anterior estuvo en /abort-register
              localStorage.removeItem('urlPrevious-abort');
              return;
            }
          }
        } else {
          localStorage.removeItem('urlPrevious-abort');
          localStorage.removeItem('urlPrevious');
          this.show = !this.urlActual.includes('politica');
        }
      }
    });
  }

  exit(event: any) {
    this.isRegistering = false;
  }
  onScroll(event: any) {
    this.floatingBtn.onScrollContainer(this.divMain.nativeElement.scrollTop);
  }
}
