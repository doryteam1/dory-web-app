import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-transportador',
  templateUrl: './interfaz-transportador.component.html',
  styleUrls: ['./interfaz-transportador.component.scss']
})
export class InterfazTransportadorComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
