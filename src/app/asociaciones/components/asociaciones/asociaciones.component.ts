import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asociaciones',
  templateUrl: './asociaciones.component.html',
  styleUrls: ['./asociaciones.component.scss']
})
export class AsociacionesComponent implements OnInit {

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
  granjas:number = 0;

  municSeleccionado:any = {
    municipio:"Cargando...",
    poblacion:0,
    granjas:0
  }

  
  resumenDepartamento = [
    {
      codigo:70713,
      municipio:"San Onofre",
      poblacion:50647,
      granjas:25
    },
    {
      codigo:70820,
      municipio:"Santiago de Tolú",
      poblacion:33871,
      granjas:5
    },
    {
      codigo:70823,
      municipio:"Tolu Viejo",
      poblacion:18895,
      granjas:10
    },
    {
      codigo:70204,
      municipio:"Colosó",
      poblacion:5803,
      granjas:2
    },
    {
      codigo:70230,
      municipio:"Chalán",
      poblacion:4367,
      granjas:9
    },
    {
      codigo:70508,
      municipio:"Ovejas",
      poblacion:21030,
      granjas:5
    },
    {
      codigo:70523,
      municipio:"Palmito",
      poblacion:13953,
      granjas:32
    },
    {
      codigo:70001,
      municipio:"Sincelejo",
      poblacion:279027,
      granjas:14
    },
    {
      codigo:70473,
      municipio:"Morroa",
      poblacion:14583,
      granjas:41
    },
    {
      codigo:70418,
      municipio:"los Palmitos",
      poblacion:19245,
      granjas:59
    },
    {
      codigo:70717,
      municipio:"San Pedro",
      poblacion:16005,
      granjas:45
    },
    {
      codigo:70670,
      municipio:"Sampues",
      poblacion:38067,
      granjas:3
    },
    {
      codigo:70215,
      municipio:"Corozal",
      poblacion:62830,
      granjas:56
    },
    {
      codigo:70702,
      municipio:"San Juan de Betulia",
      poblacion:12557,
      granjas:19
    },
    {
      codigo:70742,
      municipio:"Sincé",
      poblacion:34016,
      granjas:20
    },
    {
      codigo:70110,
      municipio:"Buenavista",
      poblacion:9618,
      granjas:10
    },
    {
      codigo:70233,
      municipio:"El Roble",
      poblacion:10670,
      granjas:11
    },
    {
      codigo:70235,
      municipio:"Galeras",
      poblacion:20515,
      granjas:16
    },
    {
      codigo:70678,
      municipio:"San Benito Abad",
      poblacion:25723,
      granjas:80
    },
    {
      codigo:70400,
      municipio:"La Unión",
      poblacion:11262,
      granjas:39
    },
    {
      codigo:70124,
      municipio:"Caimito",
      poblacion:12184,
      granjas:23
    },
    {
      codigo:70771,
      municipio:"Sucre",
      poblacion:22403,
      granjas:67
    },
    {
      codigo:70708,
      municipio:"San Marcos",
      poblacion:57775,
      granjas:87
    },
    {
      codigo:70429,
      municipio:"Majagual",
      poblacion:33438,
      granjas:28
    },
    {
      codigo:70265,
      municipio:"Guaranda",
      poblacion:17646,
      granjas:29
    },
    {
      codigo:70221,
      municipio:"Coveñas",
      poblacion:13779,
      granjas:54
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
      this.granjas = this.granjas + resum.granjas;
    })
  }

}
