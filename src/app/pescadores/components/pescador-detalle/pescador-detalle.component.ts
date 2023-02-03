import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PescadoresService } from '../../services/pescadores.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';

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
  activatelistasociacion: boolean = false;
  changeItem: boolean = true;
  authUserId: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private pescadoresService: PescadoresService,
    private router: Router,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService
  ) {}

  ngOnInit(): void {
    this.selectedPescadorId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.authUserId = this.evaluateRegisteredUserService.evaluateUser(
      this.selectedPescadorId
    );
    this.pescadoresService
      .getPescadorDetalle(this.selectedPescadorId)
      .subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.pescador = response.data[0];
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
    this.getAsociaciones();
  }
  handleResponse(response: any) {
    if (!response.data.length) {
      this.showNotFound = true;
      this.showError = false;
      this.changeItem = false;
    } else {
      this.pescadorasociaciones = response.data;
      this.showError = false;
      this.showNotFound = false;
      this.changeItem = false;
    }
  }
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.selectedPescadorId,
      ', para enviarle un mensaje a este usuario'
    );
  }

  handleError(err: any) {
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
  getAsociaciones() {
    this.pescadoresService
      .getAsociacionesUsuario(this.selectedPescadorId)
      .subscribe(
        (response: any) => {
          if (!response.data.length) {
            this.pescadoresService
              .getAsociacionesIsMiembroUser(this.selectedPescadorId)
              .subscribe(
                (response: any) => this.handleResponse(response),
                (err) => this.handleError(err)
              );
          } else {
            this.handleResponse(response);
          }
        },
        (err) => this.handleError(err)
      );
  }

  goAssociationDetail(asociacion: any) {
    this.router.navigateByUrl(
      '/asociaciones/municipio/detalle/' + asociacion.nit
    );
  }
  goDetalleRepresentante(asociacion: any) {
    if (asociacion.tipo_propietario == 'Pescador') {
      this.router.navigateByUrl(
        '/pescadores/municipio/detalle/' + asociacion.id_propietario
      );
    } else if (asociacion.tipo_propietario == 'Piscicultor') {
      this.router.navigateByUrl(
        '/piscicultores/municipio/detalle/' + asociacion.id_propietario
      );
    }
  }
  openAsocia() {
    if (this.activatelistasociacion) {
      this.activatelistasociacion = false;
    } else {
      this.activatelistasociacion = true;
    }
  }
}
