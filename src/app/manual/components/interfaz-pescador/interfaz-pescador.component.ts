import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-pescador',
  templateUrl: './interfaz-pescador.component.html',
  styleUrls: ['./interfaz-pescador.component.scss']
})
export class InterfazPescadorComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
