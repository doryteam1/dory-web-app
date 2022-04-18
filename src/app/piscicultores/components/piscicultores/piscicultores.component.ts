import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { createUnparsedSourceFile } from 'typescript';
import { PiscicultoresService } from '../../services/piscicultores.service';

@Component({
  selector: 'app-piscicultores',
  templateUrl: './piscicultores.component.html',
  styleUrls: ['./piscicultores.component.scss']
})
export class PiscicultoresComponent implements OnInit {
  sanOnofreActive:boolean = true;
  toluActive:boolean = true;
  toluViejoActive:boolean = true;
  covenasActive:boolean = true;
  colosoActive:boolean = true;
  chalanActive:boolean = true;
  ovejasActive:boolean = true;
  palmitoActive:boolean = true;
  sincelejoActive:boolean = true;
  morroaActive:boolean = true;
  losPalmitosActive:boolean = true;
  sanPedroActive:boolean = true;
  sampuesActive:boolean = true;
  corozalActive:boolean = true;
  sanJuanDeBetuliaActive:boolean = true;
  sinceActive:boolean = true;
  buenaVistaActive:boolean = true;
  elRobleActive:boolean = true;
  galerasActive:boolean = true;
  sanBenitoAbadActive:boolean = true;
  laUnionActive:boolean = true;
  caimitoActive:boolean = true;
  sucreActive:boolean = true;
  sanMarcosActive:boolean = true;
  majagualActive:boolean = true;
  guarandaActive:boolean = true;
  poblacion:number = 0;
  piscicultores:number = 0;

  municSeleccionado:any = {
    municipio:"Cargando...",
    poblacion:0,
    piscicultores:0
  }

  
  resumenDepartamento:Array<any> = []
  constructor(private pService:PiscicultoresService) { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.pService.getPiscicultoresDepartamento(70).subscribe(
      (response)=>{
        this.resumenDepartamento = response.data;
        this.totalizer();
      },err=>{
        console.log(err);
      }
    )
    
  }

  changeSelected(codigo:number){
    let index = this.resumenDepartamento.findIndex((dataMunic)=> dataMunic.id_municipio == codigo);
    if(index != -1){
      this.municSeleccionado = this.resumenDepartamento[index];
    }
  }

  totalizer(){
      this.resumenDepartamento.forEach((resum)=>{
      this.poblacion = this.poblacion + resum.poblacion;
      this.piscicultores = this.piscicultores + resum.count_piscicultores;
    })
  }
}
