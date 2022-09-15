import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { ProveedorService } from 'src/app/services/proveedor.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.scss']
})
export class ProductoDetalleComponent implements OnInit {
  selectedId: number = -1;
  producto: any;
  images:GalleryItem[] = [];
  fullScreen:boolean = true;
  constructor(private proveedorService:ProveedorService, private activatedRoute:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.selectedId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    console.log("Detalle producto..")
    this.proveedorService.getProductoDetail(this.selectedId).subscribe(
      (response)=>{
        console.log("Detalle producto dentro",response)
        this.producto = response?.data[0]
        if(this.producto && this.producto.fotos_producto){
          this.images = this.mapImages(this.producto.fotos_producto);
        }
      },err=>{
        console.log(err)
      }
    )
  }

  mapImages(images:Array<string>):GalleryItem[]{
    return images.map((element)=> new ImageItem({src:element, thumb:element}))
  }

  goDetail(id:number){
    this.router.navigateByUrl('proveedores/detalle/'+id)
    /* let url = this.router.serializeUrl(
      this.router.createUrlTree([
        'transportadores/detalle/'+id,
      ])
    );
    window.open(url, '_blank'); */
  }
}
