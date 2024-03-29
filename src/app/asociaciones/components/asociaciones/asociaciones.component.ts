import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsociacionesService } from '../../services/asociaciones.service';

@Component({
  selector: 'app-asociaciones',
  templateUrl: './asociaciones.component.html',
  styleUrls: ['./asociaciones.component.scss']
})
export class AsociacionesComponent implements OnInit {
  poblacion:number = 0;
  asociaciones:number = 0;
  municSeleccionado:any = {
    municipio:"Cargando...",
    poblacion:0,
    count:0
  }


  resumenDepartamento:any = [];
  constructor(private asociacionService:AsociacionesService, private router:Router) { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.asociacionService.getAsociacionesDpto(70).subscribe(
      (response)=>{
        this.resumenDepartamento = response.data;
        this.totalizer();
      },err=>{
        console.log(err)
      }
    )

  }

  changeSelected(codigo:number){
    let index = this.resumenDepartamento.findIndex((dataMunic:any)=> dataMunic.id_municipio == codigo);
    if(index != -1){
      this.municSeleccionado = {
        nombre : this.resumenDepartamento[index].nombre,
        poblacion : this.resumenDepartamento[index].poblacion,
        count: this.resumenDepartamento[index].count_asociaciones
      }
    }
  }

  totalizer(){
      this.resumenDepartamento.forEach((resum:any)=>{
      this.poblacion = this.poblacion + resum.poblacion;
      this.asociaciones = this.asociaciones + resum.count_asociaciones;
    })
  }

  munClick(mun:number){
    this.changeSelected(mun);
    this.router.navigateByUrl('/asociaciones/municipio/'+mun)
  }

  munOver(mun:number){
    this.changeSelected(mun);
  }
}
