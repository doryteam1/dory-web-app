import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { createUnparsedSourceFile } from 'typescript';
import { PescadoresService } from '../../services/pescadores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pescadores',
  templateUrl: './pescadores.component.html',
  styleUrls: ['./pescadores.component.scss']
})
export class PescadoresComponent implements OnInit {
  poblacion:number = 0;
  pescadores:number = 0;
  municSeleccionado:any = {
    municipio:"Cargando...",
    poblacion:0,
    count:0
  }
  resumenDepartamento:Array<any> = []
  constructor(private pService:PescadoresService, private router:Router) { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.pService.getPescadoresDepartamento(70).subscribe(
      (response:any)=>{
        this.resumenDepartamento = response.data;
        this.totalizer();
      },err=>{
        console.log(err);
      }
    );
  }

  changeSelected(codigo:number){
    let index = this.resumenDepartamento.findIndex((dataMunic)=> dataMunic.id_municipio == codigo);
    if(index != -1){
      this.municSeleccionado = {
        nombre : this.resumenDepartamento[index].nombre,
        poblacion : this.resumenDepartamento[index].poblacion,
        count: this.resumenDepartamento[index].count_pescadores
      }
    }
  }

  totalizer(){
      this.resumenDepartamento.forEach((resum)=>{
      this.poblacion = this.poblacion + resum.poblacion;
      this.pescadores = this.pescadores + resum.count_pescadores;
    })
  }

  munClick(mun:number){
    console.log(mun)
    this.changeSelected(mun);
    this.router.navigateByUrl('/pescadores/municipio/'+mun)
  }

  munOver(mun:number){
    this.changeSelected(mun);
  }
}
