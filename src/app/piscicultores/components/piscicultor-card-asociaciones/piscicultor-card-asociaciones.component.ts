import { Component, Input, OnInit } from '@angular/core';
import { PiscicultoresService } from '../../services/piscicultores.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-piscicultor-card-asociaciones',
  templateUrl: './piscicultor-card-asociaciones.component.html',
  styleUrls: ['./piscicultor-card-asociaciones.component.scss'],
})
export class PiscicultorCardAsociacionesComponent implements OnInit {
  @Input() selectedPiscicultorId!: number;
  
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorasociaciones: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  foto_camaracpdf!: string;
  constructor(
    private piscicultoresService: PiscicultoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.selectedPiscicultorId);
    this.piscicultoresService
      .getPiscicultorDetalleAsociaciones(this.selectedPiscicultorId)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.piscicultorasociaciones = response.data;
            if (this.piscicultorasociaciones !== "") {
              this.foto_camaracpdf = 'assets/images/pdf_camara_comercio.svg';
            }else{
              this.foto_camaracpdf = 'assets/images/sinpdf.svg';
            }
            this.showError = false;
            this.showNotFound = false;
            this.changeItem = false;
          } else {
            this.changeItem = false;
            this.showNotFound = true;
            this.showError = false;
          }
        },
        (err) => {
          this.ngOnlnitPiscicultorDetalle = true;
          this.showNotFound = false;
          this.showError = false;
          this.changeItem = false;
          if (err.status == 404) {
            this.showNotFound = true;
          } else {
            this.showError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );
  }
  navigate(id: number) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + id);
  }
}


