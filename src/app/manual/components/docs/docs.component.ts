import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var window: any;
@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  innerWidth:number = window.innerWidth;
  offcanvas: any;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  constructor(private router:Router) { 
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
