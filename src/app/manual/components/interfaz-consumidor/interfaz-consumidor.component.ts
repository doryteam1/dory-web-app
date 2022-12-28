import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-consumidor',
  templateUrl: './interfaz-consumidor.component.html',
  styleUrls: ['./interfaz-consumidor.component.scss']
})
export class InterfazConsumidorComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
