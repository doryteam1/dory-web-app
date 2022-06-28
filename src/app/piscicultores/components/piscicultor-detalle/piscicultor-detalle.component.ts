import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PiscicultoresService } from '../../services/piscicultores.service';

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
  activatelistgranja: boolean=true;
  activatelistasociacion: boolean=false;
  ngOnlnitPiscicultorDetalle: boolean=false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private piscicultoresService: PiscicultoresService
  ) {}

  ngOnInit(): void {
    this.selectedPiscicultorId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    console.log(this.selectedPiscicultorId);
    this.piscicultoresService
      .getPiscicultorDetalle(this.selectedPiscicultorId)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.ngOnlnitPiscicultorDetalle = true;
            this.piscicultor = response.data[0];
            console.log(this.piscicultor)
            this.showError = false;
            this.showNotFound = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
          }
        },
        (err) => {
          this.ngOnlnitPiscicultorDetalle = true;
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
        (response) => {
          if (response.data.length > 0) {
            /* this.ngOnlnitPiscicultorDetalle = true; */
            this.piscicultorasociaciones = response.data;
            console.log(this.piscicultorasociaciones);
            this.showError = false;
            this.showNotFound = false;
          } else {
            console.log(response.data);
            this.showNotFound = true;
            this.showError = false;
          }
        },
        (err) => {
          this.ngOnlnitPiscicultorDetalle = true;
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
      .getPiscicultorDetalleGranjas(this.selectedPiscicultorId)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.piscicultorgranjas = response.data;
            console.log(this.piscicultorgranjas);
            this.showError = false;
            this.showNotFound = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
          }
        },
        (err) => {
          this.ngOnlnitPiscicultorDetalle = true;
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
  }
  mygranjaAndAsociacionActive(i:number){
    if (i==1) {
      this.activatelistgranja=true
      this.activatelistasociacion = false;
    }else if(i==2){
this.activatelistasociacion=true
this.activatelistgranja = false;
    }

  }
}
