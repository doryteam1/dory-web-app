import {
  DatePipe,
  PlatformLocation,
  registerLocaleData,
  TitleCasePipe,
} from '@angular/common';
import es from '@angular/common/locales/es';
import { Component,OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EquipoTrabajoService } from 'src/app/services/equipo-trabajo.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
 interface equipotrabajo {
   id?: number;
   nombres: string;
   apellidos: string;
   descripcion: string;
   imagen: string;
   fecha_nacimiento: Date;
   cargo: string;
   municipio: string;
   departamento: string;
   pais: string;
   url_enlace: string;
   arrayEnlaces: string[];
 }
@Component({
  selector: 'app-equipo-trabajo',
  templateUrl: './equipo-trabajo.component.html',
  styleUrls: ['./equipo-trabajo.component.scss'],
})
export class EquipoTrabajoComponent implements OnInit {
  form: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  });
  equipoTrabajo: equipotrabajo[] = [];
  datosConocenos: any;
  miembro: any;
  modalMode: any = 'visualice';
  loading = false;
  showError: boolean = false;
  showNotFound: boolean = false;
  authUserId: number = -1;
  constructor(
    private equipoTrabajoService: EquipoTrabajoService,
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private router: Router,
    private titleCasePipe: TitleCasePipe,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.cargaService();
    this.cargaServiceDos();
  }
  cargaService() {
    this.equipoTrabajoService.getMiembrosEquipo().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.equipoTrabajo = response.data;
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
  cargaServiceDos() {
    this.equipoTrabajoService.getConocenos().subscribe(
      (response) => {
        this.datosConocenos = response.data[0];
      },
      (err) => {
        console.log(err);
      }
    );
  }
  locationData(miembro: any): string {
    let location: string = this.titleCasePipe.transform(
      miembro?.municipio + ', ' + miembro?.departamento + ', ' + miembro?.pais
    );
    let fecha_nacimiento: any = this.datePipe.transform(
      miembro?.fecha_nacimiento,
      'yyyy'
    );
    let datosNacimiento: string = location + ', ' + fecha_nacimiento;
    return datosNacimiento;
  }

  deleteMiembro(idMiembro: any, nombre: any, imagen: any, idx: any) {
    this.appModalService
      .confirm(
        'Eliminar miembro',
        'Esta seguro que desea eliminar este miembro',
        'Si',
        'No',
        nombre
      )
      .then((result) => {
        if (result == true) {
          this.equipoTrabajoService.deleteMiembroEquipo(idMiembro).subscribe(
            (response) => {
              this.equipoTrabajo.splice(idx, 1);
              this.storage.deleteByUrl(imagen);
              if (this.equipoTrabajo.length <= 0) {
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
  editarData(idMiembro: any) {
    let object: any = {
      id: idMiembro,
      action: 'update',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/equipo-trabajo-admi/detalle', object]);
  }
  openFormCrear() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/equipo-trabajo-admi/detalle', object]);
  }
  /* Funciones edicion de titulo y descripción */
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  cancelingEdition() {
    this.modalMode = 'visualice';
    if ((this.modalMode = 'visualice')) {
      this.cargaServiceDos();
    }
  }
  updateData() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    this.equipoTrabajoService
      .updateConocenos(1, {
        titulo: this.titulo?.value,
        descripcion: this.descripcion?.value,
      })
      .subscribe(
        (response) => {
          this.loading = false;
          this.form.enable();
          this.cancelingEdition();
        },
        (err) => {
          this.loading = false;
          this.form.enable();
          console.log(err);
        }
      );
  }

  EditionParagraph() {
    this.modalMode = 'update';
    if (this.modalMode == 'update') {
      this.titulo?.setValue(this.datosConocenos?.titulo);
      this.descripcion?.setValue(this.datosConocenos?.descripcion);
    }
  }
  get titulo() {
    return this.form.get('titulo');
  }
  get descripcion() {
    return this.form.get('descripcion');
  }
}
