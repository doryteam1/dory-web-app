import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalcHeightNavbarService } from 'src/app/services/calc-height-navbar.service';
declare var window: any;
@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
})
export class DocsComponent implements OnInit, OnDestroy {
  innerWidth: number = window.innerWidth;
  offcanvas: any;
  heightNavbar: any;
  heightNavbarSubsx1!: Subscription;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  constructor(public calcHeightNavbarService: CalcHeightNavbarService) {
    this.heightNavbarSubsx1 =
      this.calcHeightNavbarService.currentUser.subscribe((height: any) => {
        this.heightNavbar = height;
      });
  }

  ngOnDestroy(): void {
    this.heightNavbarSubsx1.unsubscribe();
  }
  ngOnInit(): void {
    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvas'),
      {
        backdrop: true,
      }
    );
  }

  openOffcanvas() {
    this.offcanvas.show();
  }
  closeOffcanvas() {
    this.offcanvas.hide();
  }
}
