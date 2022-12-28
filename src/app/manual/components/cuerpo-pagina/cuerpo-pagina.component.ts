import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cuerpo-pagina',
  templateUrl: './cuerpo-pagina.component.html',
  styleUrls: ['./cuerpo-pagina.component.scss']
})
export class CuerpoPaginaComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
