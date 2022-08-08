import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FloatingBtnAutoUpComponent } from './shared/components/floating-btn-auto-up/floating-btn-auto-up.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'web-app-dory';
  isRegistering: boolean = false;
  activate: boolean = false;
  @ViewChild(FloatingBtnAutoUpComponent) floatingBtn!:FloatingBtnAutoUpComponent;
  @ViewChild('main') divMain!:ElementRef;
  constructor(
  ) {}
  exit(event: any) {
    console.log('exit app');
    this.isRegistering = false;
  }
  botonAtrasAlante(event: boolean) {
    this.activate = event
  }

  onScroll(event:any){
    this.floatingBtn.onScrollContainer(this.divMain.nativeElement.scrollTop)
  }
}
