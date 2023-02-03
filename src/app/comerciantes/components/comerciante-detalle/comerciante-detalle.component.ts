import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { NegociosService } from 'src/app/services/negocios.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-comerciante-detalle',
  templateUrl: './comerciante-detalle.component.html',
  styleUrls: ['./comerciante-detalle.component.scss'],
})
export class ComercianteDetalleComponent implements OnInit {
  selectedUserId: number = -1;
  comerciante: any;
  showNotFound: boolean = false;
  showError: boolean = false;
  errorMessage = '';
  showNotFoundDataUser: boolean = false;
  showErrorDataUser: boolean = false;
  negociosUser: any;
  authUserId: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsuarioService,
    private negociosService: NegociosService,
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
          this.comerciante = response.data[0];
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
    this.negociosService.getNegociosByUserId(this.selectedUserId).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.negociosUser = response.data;
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
          console.log(this.errorMessage);
        }
      }
    );
  }
  goDetail(id: number) {
    const url = `comerciantes/negocio/detalle/${id}`;
    this.router.navigateByUrl(url);
  }
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.selectedUserId,
      ', para enviarle un mensaje a este usuario'
    );
  }
}
