import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
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
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsuarioService,
    private negociosService: NegociosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedUserId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
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
          console.log(this.negociosUser);
          this.showErrorDataUser = false;
          this.showNotFoundDataUser = false;
        } else {
          this.showNotFoundDataUser = true;
          this.showErrorDataUser = false;
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
    if (this.electronActive) {
      this.router.navigateByUrl(url);
    } else {
      const serializedUrl = this.router.serializeUrl(
        this.router.createUrlTree([url])
      );
      window.open(serializedUrl, '_blank');
    }
  }
}
