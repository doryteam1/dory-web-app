import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
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
declare const process: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  title = 'web-app-dory';
  isRegistering: boolean = false;
  customTitleBarElectron: boolean = false;
  @ViewChild(FloatingBtnAutoUpComponent)
  floatingBtn!: FloatingBtnAutoUpComponent;
  @ViewChild('main') divMain!: ElementRef;
  @ViewChild('navbarDiv') navbarDiv!: ElementRef;
  isAuthUser: boolean = false;
  show: boolean = true;
  height: any;
  previousHeight: any[] = [];

  constructor(
    private _electronService: ElectronjsService,
    public userService: UsuarioService,
    private chatService: ChatService,
    private router: Router,
    public calcHeightNavbarService: CalcHeightNavbarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngAfterViewChecked(): void {
    //Comparamos el primer dato con el actual
    let onNavbarDiv=this.navbarDiv?.nativeElement?.clientHeight;
    if (this.height !== onNavbarDiv) {
      this.height = onNavbarDiv;
      //Actualizamos el primer dato y detectamos cualquier cambio en height
      this.changeDetectorRef.detectChanges();
      this.previousHeight = [`calc(100% - ${this.height}px)`, this.height];
      //Creamos un array y lo enviamos atravez del servico
      this.calcHeightNavbarService.updateData(this.previousHeight);
    }
  }

  ngAfterViewInit(): void {
    /* Obtenemos el primer dato de height */
    this.height = this.navbarDiv?.nativeElement?.clientHeight;
    this.previousHeight = [`calc(100% - ${this.height}px)`, this.height];
    this.calcHeightNavbarService.updateData(this.previousHeight);
  }
  ngOnInit(): void {
    this.isAuthUser = this.userService.isAuthenticated();
    //console.log("process.env.FIREBASE_PROJECT_ID ", process.env.FIREBASE_PROJECT_ID)
    this.customTitleBarElectron = this._electronService.ipcActivo;
    this.userService.getAuthObservable().subscribe((isAuth) => {
      this.isAuthUser = isAuth;
      if (!this.isAuthUser) {
        this.chatService.disconnect();
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.divMain!.nativeElement!.scroll(0, 0);
        let route: string = event.url;
        if (route.includes('welcome') || route.includes('politica')) {
          this.show = false;
        } else {
          this.show = true;
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
