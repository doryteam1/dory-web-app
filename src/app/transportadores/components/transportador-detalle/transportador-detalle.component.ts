import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-transportador-detalle',
  templateUrl: './transportador-detalle.component.html',
  styleUrls: ['./transportador-detalle.component.scss']
})
export class TransportadorDetalleComponent implements OnInit {
  selectedUserId: number = -1;
  transportador: any;
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
            this.transportador = response.data[0];
            console.log(this.transportador);
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
