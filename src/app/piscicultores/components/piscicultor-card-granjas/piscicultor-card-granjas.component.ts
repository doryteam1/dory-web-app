import { Component, Input, OnInit } from '@angular/core';
import { PiscicultoresService } from '../../services/piscicultores.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-piscicultor-card-granjas',
  templateUrl: './piscicultor-card-granjas.component.html',
  styleUrls: ['./piscicultor-card-granjas.component.scss'],
})
export class PiscicultorCardGranjasComponent implements OnInit {
  @Input() selectedPiscicultorId!: number;
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorgranjas: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  constructor(
    private piscicultoresService: PiscicultoresService,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log(this.selectedPiscicultorId);
    this.piscicultoresService
      .getPiscicultorDetalleGranjas(this.selectedPiscicultorId)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.piscicultorgranjas = response.data;
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
  changeFavorite(i: number) {
    console.log(i);
    this.piscicultorgranjas[i].esfavorita =this.piscicultorgranjas[i].esfavorita == 1 ? 0 : 1;
    this.piscicultoresService
      .esFavorita(this.piscicultorgranjas[i].id_granja)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (err) => {
          console.log(err);
          this.piscicultorgranjas[i].esfavorita =this.piscicultorgranjas[i].esfavorita == 1 ? 0 : 1;
        }
      );
  }
  navigate(id: number) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + id);
  }
}
