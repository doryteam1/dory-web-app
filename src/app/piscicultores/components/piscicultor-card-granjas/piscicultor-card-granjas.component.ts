import { Component, Input, OnInit } from '@angular/core';
import { PiscicultoresService } from '../../services/piscicultores.service';

@Component({
  selector: 'app-piscicultor-card-granjas',
  templateUrl: './piscicultor-card-granjas.component.html',
  styleUrls: ['./piscicultor-card-granjas.component.scss'],
})
export class PiscicultorCardGranjasComponent implements OnInit {
  /* @Input() granjas: any = []; */
  @Input() selectedPiscicultorId!: number;
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorgranjas: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  constructor(private piscicultoresService: PiscicultoresService) {}
  ngOnInit(): void {
    console.log(this.selectedPiscicultorId);
    this.piscicultoresService
      .getPiscicultorDetalleGranjas(this.selectedPiscicultorId)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.piscicultorgranjas = response.data;
            console.log(this.piscicultorgranjas);
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
    /*   this.granjax=this.granjas
    console.log(this.granjax);
    if (this.granjax.length < 1) {
      setTimeout(() => {
        this.changeItem = false;
        this.showNotFound = true;
        this.myNgOnlnit();
      }, 5000);
    } else if (this.granjax.length > 0) {
      this.changeItem = false;
    } */
  }
  /*  myNgOnlnit() {
    if (this.granjax.length > 0) {
      this.showNotFound = false;
    }
  } */
  showResenas() {}
  navigate(i: number) {}
  changeFavorite(i: number) {
    console.log(i)
    let date = new Date();
    console.log(date.toISOString().split('T')[0]);
    const horas = new Date();

    console.log(horas.getHours());

    this.piscicultorgranjas[i].esfavorita =
      this.piscicultorgranjas[i].esfavorita == 1 ? 0 : 1;
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
}
