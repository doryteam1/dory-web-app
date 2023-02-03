import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ProductDetailsCardTemplate } from 'src/models/productDetailsCardTemplate.model';


@Component({
  selector: 'app-vehiculo-detalle',
  templateUrl: './vehiculo-detalle.component.html',
  styleUrls: ['./vehiculo-detalle.component.scss'],
})
export class VehiculoDetalleComponent implements OnInit {
  selectedId: number = -1;
  vehiculo: any;
  images: any = [];
  electronActive: any = window.require;
  authUserId: boolean = false;
  showLess: boolean = true;
  datos!: ProductDetailsCardTemplate;
  contentLoaded: boolean = false;
  constructor(
    private vehiculoService: VehiculosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService
  ) {}
  ngOnInit(): void {
    this.selectedId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.vehiculoService.getDetail(this.selectedId).subscribe(
      (response) => {
        this.vehiculo = response?.data[0];
        this.authUserId = this.evaluateRegisteredUserService.evaluateUser(
          this.vehiculo?.usuarios_id
        );
        if (this.vehiculo && this.vehiculo.fotos_vehiculos) {
          this.images = this.vehiculo.fotos_vehiculos;
        }
        this.datos = {
          headerTitle: this.vehiculo?.modelo,
          headeSubtitle: `${this.vehiculo?.capacidad} TON`,
          images: this.images,
          idCard: 'vehiculodetallesFotos',
          authUserId: this.authUserId,
          nameUser: this.vehiculo?.propietario,
          department: this.vehiculo?.departamento_propietario,
          municipality: this.vehiculo?.municipio_propietario,
          phone: this.vehiculo?.celular,
          email: this.vehiculo?.email,
          productDetailsTitle: [
            { data: this.vehiculo?.modelo },
            {
              data: `${this.vehiculo?.capacidad}TON`,
            },
            {
              data: this.vehiculo?.transporte_alimento ? 'Si' : 'No',
            },
          ],
          infoAdicionalTitle: 'Descripción adicional del vehículo',
          infoAdicionalData: this.vehiculo?.descripcion,
        };
           this.contentLoaded = true;
      },
      (err) => {
           this.contentLoaded = true;
        console.log(err);
      }
    );
  }

  goDetail(id: number) {
    this.router.navigateByUrl('transportadores/detalle/' + id);
  }
  toggleContent() {
    this.showLess = !this.showLess;
  }
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.vehiculo?.usuarios_id,
      ', para enviarle un mensaje a este usuario'
    );
  }
}
