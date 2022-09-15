import { Component, ElementRef ,OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-productos',
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.scss'],
})
export class MisProductosComponent implements OnInit{
  @ViewChild('paginatio') paginatio!: ElementRef;
  productos: Array<any> = [];
  showNotFound: boolean = false;
  p!: number;
  authUserId: number = -1;
  constructor(
    private proveedorService: ProveedorService,
    private appModalService: AppModalService,
    public platformLocation: PlatformLocation,
    private router: Router
  ) {}
  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.proveedorService.getProductosById(this.authUserId).subscribe(
      (respose) => {
        this.showNotFound = false;
        this.productos = respose.data;
        console.log(this.productos);
        if (this.productos.length < 1 || this.productos.length == 0) {
          this.showNotFound = true;
        }
      },
      (err) => {
        if (err.status == 404) {
          this.showNotFound = true;
        }
        console.log(err);
      }
    );
  }
  deleteProducto(codigo: number) {
    let i = this.productos.findIndex((producto: any) => {
      return producto.codigo == codigo;
    });
    this.appModalService
      .confirm(
        'Eliminar producto',
        'Esta seguro que desea eliminar el producto',
        'Si',
        'No',
        this.productos[i].nombreProducto
      )
      .then((result) => {
        if (result == true) {
          this.proveedorService.deleteProducto(codigo).subscribe(
            (response) => {
              let index = this.productos.findIndex((producto: any) => {
                return producto.codigo == codigo;
              });
              this.productos.splice(index, 1);
              if (this.productos.length <= 0) {
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }
  addProducto() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/producto/detalle', object]);
  }
  updateProducto(event: any) {
    let object: any = { ...event };
    (object.action = 'update'), (object.authUserId = this.authUserId);
    this.router.navigate(['/dashboard/producto/detalle', object]);
  }
}
