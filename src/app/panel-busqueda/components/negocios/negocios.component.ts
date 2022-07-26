import { Component, OnInit } from '@angular/core';
import { NegociosService } from 'src/app/services/negocios.service';
const _ = require('lodash');

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss']
})
export class NegociosComponent implements OnInit {
  negocios:Array<any> = [];
  negociosFiltered:Array<any> = [];
  ngOnInit(): void {
    
  }

  constructor(private negociosService:NegociosService){
    this.negociosService.getNegociosAll().subscribe(
      (response)=>{
        this.negocios = response.data;
        this.negociosFiltered = this.negocios;
      }
    )
  }

  onSearch(text:string){
    console.log("negocios ",text)
    if(text == ''){
      this.negociosFiltered = this.negocios;
    }else{
      this.negociosFiltered = this.negocios.filter((element)=>{
        return element.nombre_negocio.toLocaleLowerCase().includes(text.toLocaleLowerCase());
      })
    }
}
}
