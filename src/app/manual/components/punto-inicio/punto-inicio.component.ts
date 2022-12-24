import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-punto-inicio',
  templateUrl: './punto-inicio.component.html',
  styleUrls: ['./punto-inicio.component.scss']
})
export class PuntoInicioComponent implements OnInit {
  thisWebUrl:string = environment.thisWebUrl; 
  constructor() { }

  ngOnInit(): void {
  }

}
