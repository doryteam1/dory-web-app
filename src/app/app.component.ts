import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FloatingBtnAutoUpComponent } from './shared/components/floating-btn-auto-up/floating-btn-auto-up.component';
import { ElectronjsService } from 'src/app/services/electronjs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'web-app-dory';
  isRegistering: boolean = false;
  customTitleBarElectron:boolean=false;
  @ViewChild(FloatingBtnAutoUpComponent)
  floatingBtn!: FloatingBtnAutoUpComponent;
  @ViewChild('main') divMain!: ElementRef;
  constructor(
    private cdRef: ChangeDetectorRef,
    private _electronService: ElectronjsService
  ) {

  }
  ngOnInit(): void {
this.activatebutton()
  }
  exit(event: any) {
    console.log('exit app');
    this.isRegistering = false;
  }
  activatebutton = (): void => {
    this._electronService?.send(
      'activeCustomTitleBarElectronInAngular',
      'active'
    );
    this._electronService?.on(
      'activateCustomTitleBarnElectron',
      (event: any, arg: string) => {
        this.customTitleBarElectron = arg === 'CustomTitleBarActivated';
        this.cdRef.detectChanges();
      }
    );
  };
  onScroll(event: any) {
    this.floatingBtn.onScrollContainer(this.divMain.nativeElement.scrollTop);
  }
  ngOnDestroy(): void {
    this._electronService.removeAllListeners('activateCustomTitleBarnElectron');
  }
}
