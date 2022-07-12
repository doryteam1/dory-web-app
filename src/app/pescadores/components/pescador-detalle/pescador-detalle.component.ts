import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PescadoresService } from '../../services/pescadores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pescador-detalle',
  templateUrl: './pescador-detalle.component.html',
  styleUrls: ['./pescador-detalle.component.scss'],
})
export class PescadorDetalleComponent implements OnInit {
  selectedPescadorId: number = -1;
  pescador: any;
  pescadorasociaciones: any;
  showNotFound: boolean = false;
  showError: boolean = false;
  errorMessage = '';
  activatelistgranja: boolean = false;
  activatelistasociacion: boolean = true;
  changeItem: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private pescadoresService: PescadoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedPescadorId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.pescadoresService.getPescadorDetalle(
      this.selectedPescadorId
    ).subscribe(
      (response:any) => {
        if (response.data.length > 0) {
          this.pescador = response.data[0];
          console.log(this.pescador)
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

    this.pescadoresService
      .getPescadorDetalleAsociaciones(this.selectedPescadorId)
      .subscribe(
        (response:any) => {
          if (response.data.length > 0 && response.data.length !== null) {
            this.pescadorasociaciones = response.data;
            console.log(this.pescadorasociaciones);
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
  goAssociationDetail(asociacion: any) {
    this.router.navigateByUrl(
      '/asociaciones/municipio/detalle/' + asociacion.nit
    );
  }
}
