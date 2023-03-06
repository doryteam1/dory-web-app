import { Component, OnInit } from '@angular/core';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
const _ = require('lodash');
@Component({
  selector: 'app-mis-granjas',
  templateUrl: './mis-granjas.component.html',
  styleUrls: ['./mis-granjas.component.scss'],
})
export class MisGranjasComponent implements OnInit {
  granjas: Array<any> = [];
  showNotFound: boolean = false;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  authUserId: number = -1;
  loading: boolean = false;
  showError: boolean = false;
  constructor(
    private granjaService: GranjasService,
    private appModalService: AppModalService,
    private router: Router,
    public location: PlatformLocation,
    private storage: FirebaseStorageService
  ) {}
  ngOnInit(): void {
    this.autorecarga();
  }

  autorecarga(): void {
    this.loading = true;
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.granjaService.getGranjaByUserId(payload.sub).subscribe(
      (respose) => {
        this.loading = false;
        this.granjas = respose.data;
        if (this.granjas.length < 1 || this.granjas.length == 0) {
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
  deleteGranja(granja:any) {
    let arrayFotos = granja.fotos;
    this.appModalService
      .confirm(
        'Eliminar granja',
        'Esta seguro que desea eliminar la granja',
        'Sí',
        'No',
        granja.nombre
      )
      .then((result) => {
        if (result == true) {
          this.granjaService.deleteGranja(granja.id_granja).subscribe(
            (response: any) => {
              let index = this.granjas.findIndex((granj: any) => {
                return granja.id_granja == granj.id_granja;
              });
              this.storage.deleteMultipleByUrls(arrayFotos);
              this.granjas.splice(index, 1);
              if (this.granjas.length <= 0) {
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

  createNewGranja() {
    let object = {
      action: 'create',
      formState: 'enable',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/granja/detalle', object]);
  }
  editarGranja(granja: any, formState: string) {
    let object: any = { ...granja };
    (object.action = 'update'),
      (object.formState = formState),
      (object.authUserId = this.authUserId);
    this.router.navigate(['/dashboard/granja/detalle', object]);
  }
}
