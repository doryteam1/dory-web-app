import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FloatingBtnAutoUpComponent } from './shared/components/floating-btn-auto-up/floating-btn-auto-up.component';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { environment } from 'src/environments/environment';
import { ChatService } from './services/chat.service';
import { UsuarioService } from './services/usuario.service';
import { NavigationEnd, Router } from '@angular/router';
declare const process: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'web-app-dory';
  isRegistering: boolean = false;
  customTitleBarElectron:boolean=false;
  @ViewChild(FloatingBtnAutoUpComponent)
  floatingBtn!: FloatingBtnAutoUpComponent;
  @ViewChild('main') divMain!: ElementRef;
  isAuthUser:boolean = false;
  show: boolean = true;
  constructor(
    private _electronService: ElectronjsService,
    public userService:UsuarioService,
    private chatService: ChatService,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.isAuthUser = this.userService.isAuthenticated();
    //console.log("process.env.FIREBASE_PROJECT_ID ", process.env.FIREBASE_PROJECT_ID)
    this.customTitleBarElectron = this._electronService.ipcActivo;
    this.userService.getAuthObservable().subscribe(
      (isAuth)=>{
        this.isAuthUser = isAuth;
        if(!this.isAuthUser){
          this.chatService.disconnect();
        }else{
          //this.chatService.connect();
          this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
              let route: string = event.url;
              if (route.includes('dashboard')) {
                window.location.reload();
              }
            }
          });
        }
      }
    )

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route: string = event.url;
        if (route.includes('welcome') ||
        route.includes('politica')) {
          this.show = false;
        } else {
          this.show = true;
        }
      }
    });
  }
  exit(event: any) {
    console.log('exit app');
    this.isRegistering = false;
  }
  onScroll(event: any) {
    this.floatingBtn.onScrollContainer(this.divMain.nativeElement.scrollTop);
  }

}
