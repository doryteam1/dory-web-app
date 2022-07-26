import { Component, OnInit } from '@angular/core';
import { ConsumidorService } from 'src/app/services/consumidor.service';
import { EspeciesService } from 'src/app/services/especies.service';
import { Especie } from 'src/models/especie.model';

@Component({
  selector: 'app-mi-consumo',
  templateUrl: './mi-consumo.component.html',
  styleUrls: ['./mi-consumo.component.scss']
})
export class MiConsumoComponent implements OnInit {
  consumos:Array<any> = []
  misConsumos:Array<any> = [];
  loading:boolean = false;
  
  constructor(private especiesService:EspeciesService, private consumidorService:ConsumidorService){ }

  ngOnInit(): void {
    this.especiesService.getEspecies().subscribe(
      (response)=>{
        this.consumos = response.data;
        this.consumidorService.getMisConsumos().subscribe(
          (response)=>{
            this.misConsumos = response.data;
            this.consumos.forEach((consumo)=>{
              let index = this.misConsumos.findIndex((miconsumo)=>{
                return miconsumo.id_especie == consumo.id_especie;
              })
              if(index !== -1){
                consumo.cantidad_consumo = this.misConsumos[index].cantidad_consumo;
                consumo.check = true;
              }else{
                consumo.cantidad_consumo = 0;
                consumo.check = false;
              }
            })
          }
        )
      }
    )
  }

  updateConsumo(){
    this.loading = true;
    console.log(this.consumos)
    let consumosFiltered = this.consumos.filter(
      (consumo)=>{
        return consumo.check;
      }
    )
    this.consumidorService.updateConsumo(consumosFiltered).subscribe(
      (response)=>{
        this.loading = false;
        console.log(response)
      },err=>{
        this.loading = false;
        console.log(err)
      }
    )
  }

}
