import { Component, OnInit } from '@angular/core';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tipoUsuario:string = '';

  constructor() { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    this.tipoUsuario = Utilities.parseJwt(token!).rol;
    console.log("Tipo usuario ",this.tipoUsuario)
  }

}
