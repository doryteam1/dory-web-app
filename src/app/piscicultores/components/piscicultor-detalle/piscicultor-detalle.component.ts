import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PiscicultoresService } from '../../services/piscicultores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-piscicultor-detalle',
  templateUrl: './piscicultor-detalle.component.html',
  styleUrls: ['./piscicultor-detalle.component.scss'],
})
export class PiscicultorDetalleComponent implements OnInit {
  selectedPiscicultorId: number = -1;
  piscicultor: any;
  piscicultorasociaciones: any;
  piscicultorgranjas: any;
  showNotFound: boolean = false;
  showError: boolean = false;
  errorMessage = '';
  activatelistgranja: boolean = true;
  activatelistasociacion: boolean = false;
  changeItem: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private piscicultoresService: PiscicultoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedPiscicultorId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.piscicultoresService
      .getPiscicultorDetalle(this.selectedPiscicultorId)
      .subscribe(
        (response:any) => {
          if (response.data.length > 0) {
            this.piscicultor = response.data[0];
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

    this.piscicultoresService
      .getPiscicultorDetalleAsociaciones(this.selectedPiscicultorId)
      .subscribe(
        (response:any) => {
          if (response.data.length > 0) {
            this.piscicultorasociaciones = response.data;
            console.log(this.piscicultorasociaciones)
            this.showError = false;
            this.showNotFound = false;
            this.changeItem = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
            this.changeItem = false;
          }
        },
        (err) => {
          this.showNotFound = false;
          this.showError = false;
          this.changeItem = false;
          if (err.status == 404 || err.status == 500) {
            this.showNotFound = true;
          } else {
            this.showError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );

    this.piscicultoresService
      .getPiscicultorDetalleGranjas(this.selectedPiscicultorId)
      .subscribe(
        (response:any) => {
          if (response.data.length > 0) {
            this.piscicultorgranjas = response.data;
            this.showError = false;
            this.showNotFound = false;
            this.changeItem = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
            this.changeItem = false;
          }
        },
        (err) => {
          this.showNotFound = false;
          this.showError = false;
          this.changeItem = false;
          if (err.status == 404 || err.status == 500) {
            this.showNotFound = true;
          } else {
            this.showError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );
  }
  activeTab(i: number) {
    if (i == 1) {
      this.activatelistgranja = true;
      this.activatelistasociacion = false;
    } else if (i == 2) {
      this.activatelistasociacion = true;
      this.activatelistgranja = false;
    }
  }
  goAssociationDetail(asociacion: any) {
    this.router.navigateByUrl(
      '/asociaciones/municipio/detalle/' + asociacion.nit
    );
  }
  goDetailFarm(granja: any) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + granja.id_granja);
  }
}
