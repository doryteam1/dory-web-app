import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-novedades-actualidad',
  templateUrl: './novedades-actualidad.component.html',
  styleUrls: ['./novedades-actualidad.component.scss']
})
export class NovedadesActualidadComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
