import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { ProductDetailsCardTemplate } from 'src/models/productDetailsCardTemplate.model';

@Component({
  selector: 'app-publicacion-detalle',
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.scss'],
})
export class PublicacionDetalleComponent implements OnInit {
  selectedId: number = -1;
  publicacion: any;
  images: any = [];
  authUserId: boolean = false;
  showLess: boolean = true;
  datos!: ProductDetailsCardTemplate;
  contentLoaded: boolean = false;
  constructor(
    private publicacionesService: PublicacionesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    this.selectedId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.publicacionesService.getPublicacionDetail(this.selectedId).subscribe(
      (response) => {
        this.publicacion = response?.data[0];

        this.authUserId = this.evaluateRegisteredUserService.evaluateUser(
          this.publicacion?.usuarios_id
        );
        if (this.publicacion && this.publicacion.fotos) {
          this.images = this.publicacion.fotos;
        }
        this.datos = {
          headerTitle: this.publicacion?.titulo,
          headeSubtitle: `$${this.decimalPipe.transform(
            this.publicacion?.preciokilogramo,
            '',
            'es'
          )}/Kg`,
          images: this.images,
          idCard: 'vehiculodetallesFotos',
          authUserId: this.authUserId,
          nameUser: this.publicacion?.usuario,
          department: this.publicacion?.departamento,
          municipality: this.publicacion?.municipio,
          phone: this.publicacion?.celular,
          email: this.publicacion?.email,
          productDetailsTitle: [
            { data: this.publicacion?.especie },
            {
              data: `$${this.decimalPipe.transform(
                this.publicacion?.preciokilogramo,
                '',
                'es'
              )}/Kg`,
            },

            { data: this.publicacion?.cantidad },
            {
              data: this.datePipe.transform(
                this.publicacion?.fecha,
                'dd/MM/yyyy',
                'es'
              ),
            },
          ],
          infoAdicionalData: this.publicacion?.descripcion,
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
      this.publicacion?.usuarios_id,
      ', para enviarle un mensaje a este usuario'
    );
  }
}
