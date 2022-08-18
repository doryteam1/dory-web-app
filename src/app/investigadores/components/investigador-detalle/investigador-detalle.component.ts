import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-investigador-detalle',
  templateUrl: './investigador-detalle.component.html',
  styleUrls: ['./investigador-detalle.component.scss']
})
export class InvestigadorDetalleComponent implements OnInit {
  selectedUserId: number = -1;
  investigador: any;
  showNotFound: boolean = false;
  showError: boolean = false;
  errorMessage = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.selectedUserId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.userService
      .getDetail(this.selectedUserId)
      .subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.investigador = response.data[0];
            console.log(this.investigador);
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

  }

}
