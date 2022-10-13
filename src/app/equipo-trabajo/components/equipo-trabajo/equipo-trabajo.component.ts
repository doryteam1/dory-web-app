import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipoTrabajoService } from 'src/app/services/equipo-trabajo.service';
@Component({
  selector: 'app-equipo-trabajo',
  templateUrl: './equipo-trabajo.component.html',
  styleUrls: ['./equipo-trabajo.component.scss'],
})
export class EquipoTrabajoComponent implements OnInit {
  member: any;
  equipoTrabajo: any;
  showError: boolean = false;
  showNotFound: boolean = false;
  urlcvlac: string = '';
  urlLinkedin: string = '';
  urlDefecto: string = '';
  loading: boolean = false;
  datosConocenos: any;
  constructor(
    private modalService: NgbModal,
    private equipoTrabajoService: EquipoTrabajoService,
    private titleCasePipe: TitleCasePipe,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loading=true
    /*     for (let index = 0; index < this.team.length; index++) {
      const member = this.team[index];
      this.prepararDatos(member);
    } */
        this.equipoTrabajoService.getConocenos().subscribe(
          (response) => {
            this.datosConocenos = response.data[0];
              this.equipoTrabajoService.getMiembrosEquipo().subscribe(
                (response) => {
                  if (response.data.length > 0) {
                    this.equipoTrabajo = response.data;
                    this.showError = false;
                    this.showNotFound = false;
                    this.loading = false;
                  } else {
                    this.loading = false;
                    this.showNotFound = true;
                    this.showError = false;
                  }
                },
                (err) => {
                  console.log(err);
                  this.showNotFound = false;
                  this.showError = true;
                  this.loading = false;
                }
              );

          },
          (err) => {
            this.loading = false;
            console.log(err);
          }
        );

  }
  async openModal(content: any, member: any) {
    this.urlLinkedin = '';
    this.urlcvlac = '';
    this.urlDefecto = '';
    this.member = member;
    this.member.arrayEnlaces?.forEach((enlace: any) => {
      if (enlace?.includes('linkedin') || enlace?.includes('cvlac')) {
        if (enlace?.includes('linkedin')) {
          this.urlLinkedin = enlace;
        }
        if (enlace?.includes('cvlac')) {
          this.urlcvlac = enlace;
        }
      } else {
        this.urlDefecto = enlace;
      }
    });
    this.modalService.open(content, {
      size: 'xl',
      backdropClass: 'modal-equipo-trabajo-BackdropClass',
      modalDialogClass: 'modal-equipo-trabajo-DialogClass',
      windowClass: 'modal-equipo-trabajo-ContentClass',
      centered: true,
    });
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
  // prepararDatos(member: any) {
  //   /* https://stackblitz.com/edit/angular-brujio?file=src%2Fapp%2Fapp.component.ts
  //   https://es.stackoverflow.com/questions/353855/salto-de-linea-en-servicio-angular */
  //   member.data = member.data.split('\n').join('<p />');
  //   return member;
  // }
}
