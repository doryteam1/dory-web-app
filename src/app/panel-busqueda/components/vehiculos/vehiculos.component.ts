import { Component, OnInit } from '@angular/core';
import { VehiculosService } from 'src/app/services/vehiculos.service';
const _ = require('lodash');

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {
  vehiculos:Array<any> = [];
  vehiculosFiltered:Array<any> = [];
  ngOnInit(): void {
    
  }

  constructor(private vehiculosService:VehiculosService){
    this.vehiculosService.getVehiculosAll().subscribe(
      (response)=>{
        this.vehiculos = response.data;
        this.vehiculosFiltered = this.vehiculos;
      }
    )
  }

  onSearch(text:string){
    if(text == ''){
      this.vehiculosFiltered = this.vehiculos;
    }else{
      this.vehiculosFiltered = this.vehiculos.filter((element)=>{
        return element.modelo.toLocaleLowerCase().includes(text.toLocaleLowerCase());
      })
    }
}
}
