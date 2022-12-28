import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guia-uso',
  templateUrl: './guia-uso.component.html',
  styleUrls: ['./guia-uso.component.scss']
})
export class GuiaUsoComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
