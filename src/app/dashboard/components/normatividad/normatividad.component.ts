import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NormatividadService } from 'src/app/services/normatividad.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-normatividad',
  templateUrl: './normatividad.component.html',
  styleUrls: ['./normatividad.component.scss'],
})
export class NormatividadComponent implements OnInit {
  normatividades: any[] = [];
  norma: any;
  showError: boolean = false;
  showNotFound: boolean = false;
  authUserId: number = -1;
  constructor(

    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private router: Router,
    private normatividadService: NormatividadService
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.cargaService();
  }
  cargaService() {
    this.normatividadService.getNormatividadesAll().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.normatividades = response.data;
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        console.log(err);
        this.showNotFound = false;
        this.showError = true;
      }
    );
  }
  deleteNorma(id: any, nombre: any, idx: any) {
    this.appModalService
      .confirm(
        'Eliminar norma',
        'Esta seguro que desea eliminar esta norma',
        'Si',
        'No',
        nombre
      )
      .then((result) => {
        if (result == true) {
          this.normatividadService.deleteNormatividad(id).subscribe(
            (response) => {
              this.normatividades.splice(idx, 1);
              if (this.normatividades.length <= 0) {
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }
  editarData(idNovedad: any) {
    let object: any = {
      id: idNovedad,
      action: 'update',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/normatividad-admi/detalle', object]);
  }
  openFormCrear() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/normatividad-admi/detalle', object]);
  }
}
