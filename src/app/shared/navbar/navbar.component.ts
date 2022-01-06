import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  hasAlert:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  changeAlertState(){
    this.hasAlert = !this.hasAlert;
  }
}
