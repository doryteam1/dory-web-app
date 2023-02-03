import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { NegociosService } from 'src/app/services/negocios.service';
import { ProductDetailsCardTemplate } from 'src/models/productDetailsCardTemplate.model';

@Component({
  selector: 'app-negocio-detalle',
  templateUrl: './negocio-detalle.component.html',
  styleUrls: ['./negocio-detalle.component.scss'],
})
export class NegocioDetalleComponent implements OnInit {
  selectedId: number = -1;
  negocio!: any;
  images: any = [];
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  authUserId: boolean = false;
  showLess: boolean = true;
  datos!: ProductDetailsCardTemplate;
  contentLoaded: boolean =false;
  constructor(
    private negociosService: NegociosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService
  ) {}

  ngOnInit(): void {
    this.selectedId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.negociosService.detail(this.selectedId).subscribe(
      (response) => {
        this.negocio = response?.data[0];
        this.authUserId = this.evaluateRegisteredUserService.evaluateUser(
          this.negocio?.usuarios_id
        );
        if (this.negocio && this.negocio.fotos_negocio) {
          this.images = this.negocio.fotos_negocio;
        }
        this.datos = {
          headerTitle: this.negocio?.nombre_negocio,
          headeSubtitle: `${this.negocio?.municipio}-Sucre`,
          images: this.images,
          idCard: 'id',
          authUserId: this.authUserId,
          nameUser: this.negocio?.propietario,
          phone: this.negocio?.celular,
          email: this.negocio?.email,
          productDetailsTitle: [
            {
              data: this.negocio?.nombre_negocio,
            },
            {
              data: this.negocio?.municipio,
            },
            {
              data: this.negocio?.departamento,
            },
            {
              data: this.negocio?.direccion,
            },
          ],
          infoAdicionalTitle: 'Descripción adicional del negocio',
          infoAdicionalData: this.negocio?.descripcion_negocio,
          infoAdicionalTitleTwo: 'Información adicional de la dirección',
          infoAdicionalDataTwo: this.negocio?.informacion_adicional_direccion,
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
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.negocio?.usuarios_id,
      ', para enviarle un mensaje a este usuario'
    );
  }
  goDetail(id: number) {
    const url = `comerciantes/detalle/${id}`;
    this.router.navigateByUrl(url);
  }
}
