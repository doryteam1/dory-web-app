import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-comerciante',
  templateUrl: './interfaz-comerciante.component.html',
  styleUrls: ['./interfaz-comerciante.component.scss']
})
export class InterfazComercianteComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
