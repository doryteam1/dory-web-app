import { Component,OnInit } from '@angular/core';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { Utilities } from 'src/app/utilities/utilities';
import { Router } from '@angular/router';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
@Component({
  selector: 'app-mis-vehiculos',
  templateUrl: './mis-vehiculos.component.html',
  styleUrls: ['./mis-vehiculos.component.scss'],
})
export class MisVehiculosComponent implements OnInit {
  vehiculos: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  showError: boolean = false;
  loading: boolean = false;
  constructor(
    private vehiculosService: VehiculosService,
    private router: Router,
    private appModalService: AppModalService,
    private storage: FirebaseStorageService
  ) {}
  ngOnInit(): void {
    this.loading = true;
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.vehiculosService.getVehiculosUser(this.authUserId).subscribe(
      (respose) => {
        this.loading = false;
        this.vehiculos = respose.data;
        console.log(this.vehiculos);
        if (this.vehiculos.length < 1 || this.vehiculos.length == 0) {
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
  deleteVehiculo(vehiculo:any) {
    let arrayFotos:any[] = vehiculo.fotos.filter((foto: any) => foto !== null);
    let index = this.vehiculos.findIndex((vehicul: any) => {
      return vehicul.id_vehiculo == vehiculo.id_vehiculo;
    });
    this.appModalService
      .confirm(
        'Eliminar vehículo',
        'Esta seguro que desea eliminar el vehículo con id',
        'Sí',
        'No',
        vehiculo.modelo
      )
      .then((result) => {
        if (result == true) {
          this.vehiculosService.deleteVehiculo(vehiculo.id_vehiculo).subscribe(
            (response) => {
             if (index != -1) {   
               this.vehiculos.splice(index, 1);
               if (arrayFotos.length>0) {
                 this.storage.deleteMultipleByUrls(arrayFotos);
               }
             }
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
