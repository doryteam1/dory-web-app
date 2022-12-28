import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-piscicultor',
  templateUrl: './interfaz-piscicultor.component.html',
  styleUrls: ['./interfaz-piscicultor.component.scss']
})
export class InterfazPiscicultorComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
