import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-proveedor',
  templateUrl: './interfaz-proveedor.component.html',
  styleUrls: ['./interfaz-proveedor.component.scss']
})
export class InterfazProveedorComponent implements OnInit {
  baseUrl:string = environment.ginelectURL;
  constructor() { }

  ngOnInit(): void {
  }

}
