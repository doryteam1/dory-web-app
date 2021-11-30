import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { createUnparsedSourceFile } from 'typescript';

@Component({
  selector: 'app-pescadores',
  templateUrl: './pescadores.component.html',
  styleUrls: ['./pescadores.component.scss']
})
export class PescadoresComponent implements OnInit {
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
  pescadores:number = 0;

  municSeleccionado:any = {
    municipio:"Not Selected",
    poblacion:0,
    pescadores:0
  }

  
  resumenDepartamento = [
    {
      codigo:70713,
      municipio:"San Onofre",
      poblacion:50647,
      pescadores:25
    },
    {
      codigo:70820,
      municipio:"Santiago de Tolú",
      poblacion:33871,
      pescadores:5
    },
    {
      codigo:70823,
      municipio:"Tolu Viejo",
      poblacion:18895,
      pescadores:10
    },
    {
      codigo:70204,
      municipio:"Colosó",
      poblacion:5803,
      pescadores:2
    },
    {
      codigo:70230,
      municipio:"Chalán",
      poblacion:4367,
      pescadores:9
    },
    {
      codigo:70508,
      municipio:"Ovejas",
      poblacion:21030,
      pescadores:5
    },
    {
      codigo:70523,
      municipio:"Palmito",
      poblacion:13953,
      pescadores:32
    },
    {
      codigo:70001,
      municipio:"Sincelejo",
      poblacion:279027,
      pescadores:14
    },
    {
      codigo:70473,
      municipio:"Morroa",
      poblacion:14583,
      pescadores:41
    },
    {
      codigo:70418,
      municipio:"los Palmitos",
      poblacion:19245,
      pescadores:59
    },
    {
      codigo:70717,
      municipio:"San Pedro",
      poblacion:16005,
      pescadores:45
    },
    {
      codigo:70670,
      municipio:"Sampues",
      poblacion:38067,
      pescadores:3
    },
    {
      codigo:70215,
      municipio:"Corozal",
      poblacion:62830,
      pescadores:56
    },
    {
      codigo:70702,
      municipio:"San Juan de Betulia",
      poblacion:12557,
      pescadores:19
    },
    {
      codigo:70742,
      municipio:"Sincé",
      poblacion:34016,
      pescadores:20
    },
    {
      codigo:70110,
      municipio:"Buenavista",
      poblacion:9618,
      pescadores:10
    },
    {
      codigo:70233,
      municipio:"El Roble",
      poblacion:10670,
      pescadores:11
    },
    {
      codigo:70235,
      municipio:"Galeras",
      poblacion:20515,
      pescadores:16
    },
    {
      codigo:70678,
      municipio:"San Benito Abad",
      poblacion:25723,
      pescadores:80
    },
    {
      codigo:70400,
      municipio:"La Unión",
      poblacion:11262,
      pescadores:39
    },
    {
      codigo:70124,
      municipio:"Caimito",
      poblacion:12184,
      pescadores:23
    },
    {
      codigo:70771,
      municipio:"Sucre",
      poblacion:22403,
      pescadores:67
    },
    {
      codigo:70708,
      municipio:"San Marcos",
      poblacion:57775,
      pescadores:87
    },
    {
      codigo:70429,
      municipio:"Majagual",
      poblacion:33438,
      pescadores:28
    },
    {
      codigo:70265,
      municipio:"Guaranda",
      poblacion:17646,
      pescadores:29
    },
    {
      codigo:70221,
      municipio:"Coveñas",
      poblacion:13779,
      pescadores:54
    }
  ]
  constructor() { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.totalizer();
  }

  changeSelected(codigo:number){
    let index = this.resumenDepartamento.findIndex((dataMunic)=> dataMunic.codigo == codigo);
    if(index != -1){
      this.municSeleccionado = this.resumenDepartamento[index];
    }
  }

  totalizer(){
      this.resumenDepartamento.forEach((resum)=>{
      this.poblacion = this.poblacion + resum.poblacion;
      this.pescadores = this.pescadores + resum.pescadores;
    })
  }
}
