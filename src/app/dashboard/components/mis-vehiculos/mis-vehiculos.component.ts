import { Component, HostListener,OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import {NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { Utilities } from 'src/app/utilities/utilities';
import { Router } from '@angular/router';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
@Component({
  selector: 'app-mis-vehiculos',
  templateUrl: './mis-vehiculos.component.html',
  styleUrls: ['./mis-vehiculos.component.scss'],
})
export class MisVehiculosComponent implements OnInit {
  vehiculos: Array<any> = [];
  showNotFound: boolean = false;
  p!: number;
  authUserId: number = -1;
  constructor(
    private vehiculosService: VehiculosService,
    private router: Router,
    private appModalService: AppModalService
  ) {}
  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.vehiculosService.getVehiculosUser(this.authUserId).subscribe(
      (respose) => {
        this.showNotFound = false;
        this.vehiculos = respose.data;
        console.log(this.vehiculos);
        if (this.vehiculos.length < 1 || this.vehiculos.length == 0) {
          this.showNotFound = true;
        }
      },
      (err) => {
        if (err.status == 404) {
          this.showNotFound = true;
        }
      }
    );
  }
  deleteVehiculo(id: number) {
    let i = this.vehiculos.findIndex((vehiculo: any) => {
      return vehiculo.id_vehiculo == id;
    });
    this.appModalService
      .confirm(
        'Eliminar vehículo',
        'Esta seguro que desea eliminar el vehículo con id',
        'Si',
        'No',
        this.vehiculos[i].modelo
      )
      .then((result) => {
        if (result == true) {
          this.vehiculosService.deleteVehiculo(id).subscribe(
            (response) => {
              let index = this.vehiculos.findIndex((vehiculo: any) => {
                return vehiculo.id_vehiculo == id;
              });
              this.vehiculos.splice(index, 1);
              if (this.vehiculos.length <= 0) {
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
  addVehiculo() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/vehiculo/detalle', object]);
  }
  updateVehiculo(event: any) {
    let object: any = { ...event };
    (object.action = 'update'), (object.authUserId = this.authUserId);
    this.router.navigate(['/dashboard/vehiculo/detalle', object]);
  }
}
