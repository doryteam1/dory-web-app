import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-normatividad',
  templateUrl: './normatividad.component.html',
  styleUrls: ['./normatividad.component.scss']
})
export class NormatividadComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
