
import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductDetailsCardTemplate } from 'src/models/productDetailsCardTemplate.model';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.scss'],
})
export class ProductoDetalleComponent implements OnInit {
  selectedId: number = -1;
  producto: any;
  images: any = [];
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  showLess: boolean = true;
  authUserId: boolean = false;
  contentLoaded = false;
  datos!: ProductDetailsCardTemplate;
  constructor(
    private proveedorService: ProveedorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService,
    private decimalPipe: DecimalPipe
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    this.selectedId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.proveedorService.getProductoDetail(this.selectedId).subscribe(
      (response) => {
        this.producto = response?.data[0];
        this.authUserId = this.evaluateRegisteredUserService.evaluateUser(
          this.producto?.usuarios_id
        );
        if (this.producto && this.producto.fotos_producto) {
          this.images = this.producto.fotos_producto;
        }
        this.datos = {
          headerTitle: this.producto?.nombreProducto,
          headeSubtitle: `$${this.decimalPipe.transform(
            this.producto?.precio,
            '',
            'es'
          )}`,
          images: this.images,
          idCard: 'vehiculodetallesFotos',
          authUserId: this.authUserId,
          nameUser: this.producto?.nombre_proveedor,
          department: this.producto?.departamento_proveedor,
          municipality: this.producto?.municipio_proveedor,
          phone: this.producto?.celular_proveedor,
          email: this.producto?.email_proveedor,
          productDetailsTitle: [
            { data: this.producto?.nombreProducto },
            {
              data: `$${this.decimalPipe.transform(
                this.producto?.precio,
                '',
                'es'
              )}`,
            },
          ],
          infoAdicionalData: this.producto?.descripcion,
        };
        this.contentLoaded = true;
      },
      (err) => {
        this.contentLoaded = true;
        console.log(err);
      }
    );
  }
  toggleContent() {
    this.showLess = !this.showLess;
  }
  goDetail(id: number) {
    this.router.navigateByUrl('proveedores/detalle/' + id);
  }
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.producto?.usuarios_id,
      ', para enviarle un mensaje a este usuario'
    );
  }
}
