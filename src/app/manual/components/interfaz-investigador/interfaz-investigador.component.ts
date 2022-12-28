import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-investigador',
  templateUrl: './interfaz-investigador.component.html',
  styleUrls: ['./interfaz-investigador.component.scss']
})
export class InterfazInvestigadorComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
