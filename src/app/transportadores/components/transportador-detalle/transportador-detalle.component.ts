import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-transportador-detalle',
  templateUrl: './transportador-detalle.component.html',
  styleUrls: ['./transportador-detalle.component.scss'],
})
export class TransportadorDetalleComponent implements OnInit {
  selectedUserId: number = -1;
  transportador: any;
  showNotFound: boolean = false;
  showError: boolean = false;
  errorMessage = '';
  vehiculosFiltered: any;
  showNotFoundDataUser: boolean = false;
  showErrorDataUser: boolean = false;
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  authUserId: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsuarioService,
    private vehiculoService: VehiculosService,
    private router: Router,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService
  ) {}

  ngOnInit(): void {
    this.selectedUserId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.authUserId = this.evaluateRegisteredUserService.evaluateUser(
      this.selectedUserId
    );
    this.userService.getDetail(this.selectedUserId).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.transportador = response.data[0];
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

    this.vehiculoService.getVehiculosUser(this.selectedUserId).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.vehiculosFiltered = response.data;
          this.showNotFoundDataUser = false;
        } else {
          this.showNotFoundDataUser = true;
        }
      },
      (err) => {
        console.log(err);
        this.showErrorDataUser = false;
        this.showNotFoundDataUser = false;
        if (err.status == 404) {
          this.showNotFoundDataUser = true;
        } else {
          this.showErrorDataUser = true;
          this.errorMessage = err.error.message;
        }
      }
    );
  }

  goDetail(id: number) {
    this.router.navigateByUrl('transportadores/vehiculo/detalle/' + id);
  }
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.selectedUserId,
      ', para enviarle un mensaje a este usuario'
    );
  }
}
