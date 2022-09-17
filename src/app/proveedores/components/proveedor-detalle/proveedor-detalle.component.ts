import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProveedorService } from 'src/app/services/proveedor.service';

@Component({
  selector: 'app-proveedor-detalle',
  templateUrl: './proveedor-detalle.component.html',
  styleUrls: ['./proveedor-detalle.component.scss'],
})
export class ProveedorDetalleComponent implements OnInit {
  selectedUserId: number = -1;
  proveedor: any;
  showNotFound: boolean = false;
  showError: boolean = false;
  showNotFoundDataUser: boolean = false;
  showErrorDataUser: boolean = false;
  productosUser: any;
  errorMessage = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsuarioService,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedUserId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.userService.getDetail(this.selectedUserId).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.proveedor = response.data[0];
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        this.showNotFound = false;
        this.showError = false;
        if (err.status == 404) {
          this.showNotFound = true;
        } else {
          this.showError = true;
          this.errorMessage = 'Error inesperado';
        }
      }
    );
    this.proveedorService.getProductosById(this.selectedUserId).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.productosUser = response.data;
          console.log(this.productosUser);
          this.showErrorDataUser = false;
          this.showNotFoundDataUser = false;
        } else {
          this.showNotFoundDataUser = true;
          this.showErrorDataUser = false;
        }
      },
      (err) => {
        console.log(err);
        this.showErrorDataUser = false;
        this.showNotFoundDataUser = false;
        if (err.status == 404) {
          this.showNotFoundDataUser = true;
        } else {
          this.showErrorDataUser = true;
          this.errorMessage = err.error.message;
          console.log(this.errorMessage);
        }
      }
    );
  }
  goDetail(producto: any) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/proveedores/producto/detalle/${producto.codigo}`,
      ])
    );
    window.open(url, '_blank');
  }
}
