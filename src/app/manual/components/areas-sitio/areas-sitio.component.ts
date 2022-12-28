import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-areas-sitio',
  templateUrl: './areas-sitio.component.html',
  styleUrls: ['./areas-sitio.component.scss']
})
export class AreasSitioComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { 
    console.log(this.baseUrl)
  }

  ngOnInit(): void {
  }

}
