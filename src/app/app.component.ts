import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FloatingBtnAutoUpComponent } from './shared/components/floating-btn-auto-up/floating-btn-auto-up.component';
import { ElectronjsService } from 'src/app/services/electronjs.service';
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
  constructor(
    private _electronService: ElectronjsService
  ) {
  }
  ngOnInit(): void {
    console.log("test")
    //console.log("process.env.FIREBASE_PROJECT_ID ", process.env.FIREBASE_PROJECT_ID)
    this.customTitleBarElectron = this._electronService.ipcActivo;
  }
  exit(event: any) {
    console.log('exit app');
    this.isRegistering = false;
  }
  onScroll(event: any) {
    this.floatingBtn.onScrollContainer(this.divMain.nativeElement.scrollTop);
  }

}
