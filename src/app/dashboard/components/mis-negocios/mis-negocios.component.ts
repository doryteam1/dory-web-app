import { Component, OnInit } from '@angular/core';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { NegociosService } from 'src/app/services/negocios.service';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
const _ = require('lodash');

import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
@Component({
  selector: 'app-mis-negocios',
  templateUrl: './mis-negocios.component.html',
  styleUrls: ['./mis-negocios.component.scss'],
})
export class MisNegociosComponent implements OnInit {
  negocios: Array<any> = [];
  showNotFound: boolean = false;
  indicenegocio!: number;
  authUserId: number = -1;
  negocio: any;
  loading: boolean = false;
  showError: boolean = false;
  constructor(
    private negociosService: NegociosService,
    private appModalService: AppModalService,
    public platformLocation: PlatformLocation,
    private router: Router,
    private storage: FirebaseStorageService
  ) {}

  ngOnInit(): void {
    this.AutoNgOnInit();
  }

  AutoNgOnInit(): void {
    this.loading = true;
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.negociosService.getNegociosByUserId(payload.sub).subscribe(
      (respose) => {
        this.loading = false;
        this.negocios = respose.data;
        if (this.negocios.length < 1 || this.negocios.length == 0) {
          this.showNotFound = true;
        } else {
          this.showNotFound = false;
        }
      },
      (err) => {
        console.log(err);
        if (err.status == 404) {
          this.showNotFound = true;
          this.loading = false;
        } else {
          this.showError = true;
          this.showNotFound = false;
          this.loading = false;
        }
      }
    );
  }

  deleteNegocio(negocio: any) {
    let arrayFotos = negocio.fotos.filter((foto: any) => foto !== null);;
    let index = this.negocios.findIndex(
      (element) => element.id_negocio == negocio.id_negocio
    );
    this.appModalService
      .confirm(
        'Eliminar negocio',
        'Esta seguro que desea eliminar este negocio',
        'Sí',
        'No',
        negocio.nombre
      )
      .then((result) => {
        if (result == true) {
          this.negociosService.deleteNegocio(negocio.id_negocio).subscribe(
            (response: any) => {
              if (index != -1) {
                this.negocios.splice(index, 1);
                if (arrayFotos.length > 0) {
                  this.storage.deleteMultipleByUrls(arrayFotos);
                }
              }
              if (this.negocios.length <= 0) {
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

  createNewNegocio() {
    let object = {
      action: 'create',
      formState: 'enable',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/negocio/detalle', object]);
  }
  editarNegocio(negocio: any) {
    let object: any = { ...negocio };
    (object.action = 'update'), (object.authUserId = this.authUserId);
    this.router.navigate(['/dashboard/negocio/detalle', object]);
  }
}
