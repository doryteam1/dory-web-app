import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-vehiculo-detalle',
  templateUrl: './vehiculo-detalle.component.html',
  styleUrls: ['./vehiculo-detalle.component.scss']
})
export class VehiculoDetalleComponent implements OnInit {
  selectedId: number = -1;
  vehiculo: any;
  constructor(private vehiculoService:VehiculosService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.vehiculoService.getDetail(this.selectedId).subscribe(
      (response)=>{
        this.vehiculo = response?.data[0]
      },err=>{
        
      }
    )
  }

}
