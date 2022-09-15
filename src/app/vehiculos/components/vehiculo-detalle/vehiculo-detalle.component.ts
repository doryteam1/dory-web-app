import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-vehiculo-detalle',
  templateUrl: './vehiculo-detalle.component.html',
  styleUrls: ['./vehiculo-detalle.component.scss']
})
export class VehiculoDetalleComponent implements OnInit {
  selectedId: number = -1;
  vehiculo: any;
  images:GalleryItem[] = [];
  fullScreen:boolean = true;
  constructor(private vehiculoService:VehiculosService, private activatedRoute:ActivatedRoute, private router:Router, private proveedorService:ProveedorService) { }

  ngOnInit(): void {
    this.selectedId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.vehiculoService.getDetail(this.selectedId).subscribe(
      (response)=>{
        console.log(response)
        this.vehiculo = response?.data[0]
        if(this.vehiculo && this.vehiculo.fotos_vehiculos){
          this.images = this.mapImages(this.vehiculo.fotos_vehiculos);
        }
      },err=>{
        
      }
    )

    this.proveedorService.getProductoDetail(103).subscribe(
      response=>{
        console.log(response)
      }
    )
  }

  mapImages(images:Array<string>):GalleryItem[]{
    return images.map((element)=> new ImageItem({src:element, thumb:element}))
  }

  goDetail(id:number){
    this.router.navigateByUrl('transportadores/detalle/'+id)
    /* let url = this.router.serializeUrl(
      this.router.createUrlTree([
        'transportadores/detalle/'+id,
      ])
    );
    window.open(url, '_blank'); */
  }
}
