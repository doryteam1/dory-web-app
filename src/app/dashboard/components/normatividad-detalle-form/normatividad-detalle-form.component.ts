import {
  PlatformLocation,
  registerLocaleData,
} from '@angular/common';
import es from '@angular/common/locales/es';
import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NormatividadService } from 'src/app/services/normatividad.service';
interface normatividad {
  id_normatividad?: number;
  tipo?: string;
  nombre: string;
  contenido: string;
  url_descarga: string;
  id_tipo: number;
  fecha?: any;
}

@Component({
  selector: 'app-normatividad-detalle-form',
  templateUrl: './normatividad-detalle-form.component.html',
  styleUrls: ['./normatividad-detalle-form.component.scss'],
})
export class NormatividadDetalleFormComponent implements OnInit {
  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    contenido: new FormControl('', [Validators.required]),
    url_descarga: new FormControl(''),
    id_tipo: new FormControl('', [Validators.required]),
    /* fecha: new FormControl('', [Validators.required]), */
  });
  tipoNormatividad: any = [
    { nombre: 'Ley', id: 1 },
    { nombre: 'Decreto', id: 2 },
    { nombre: 'Resolución', id: 3 },
  ];
  loading: boolean = false;
  modalMode: string = 'visualize';
  normatividad!: normatividad;
  authUserId: number = -1;
  id_normatividad: number = -1;
  constructor(
    public platformLocation: PlatformLocation,
    private ar: ActivatedRoute,
    private normatividadService: NormatividadService
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let idnormatividad = Number(this.ar.snapshot.paramMap.get('id'));
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    if (this.modalMode == 'update') {
      this.normatividadService.getNormatividadesAll().subscribe(
        (response) => {
          let index = response.data.findIndex(
            (normatividad: normatividad) =>
              normatividad.id_normatividad == idnormatividad
          );
          this.normatividad = response.data[index];
          this.id_normatividad = this.normatividad?.id_normatividad!;
          this.prepareForm();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  prepareForm() {
    if (this.modalMode == 'create') {
      this.form.reset();
      this.nombre?.setValue('');
      this.contenido?.setValue('');
      this.id_tipo?.setValue(-1);
      /* this.fecha?.setValue(''); */
      this.url_descarga?.setValue('');
      this.loading = false;
    } else if (this.modalMode == 'update') {
      this.nombre?.setValue(this.normatividad.nombre);
      this.contenido?.setValue(this.normatividad.contenido);
      this.id_tipo?.setValue(this.normatividad.id_tipo);
   /*    if (this.normatividad?.fecha) {
        let fecha = this.normatividad?.fecha as unknown as string;
        fecha = fecha.split('T')[0];
        this.fecha?.setValue(formatDate(fecha, 'yyyy-MM-dd', 'es'));
      } */
      this.url_descarga?.setValue(this.normatividad.url_descarga);
    }
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  updateData() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    let newnormatividad: normatividad = {
      contenido: this.contenido?.value,
      id_tipo: this.id_tipo?.value,
      nombre: this.nombre?.value,
      fecha: '',
      url_descarga: this.url_descarga?.value,
    };
    this.normatividadService
      .updateNormatividad(this.id_normatividad, newnormatividad)
      .subscribe(
        (response) => {
          this.goBack();
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.goBack();
          this.loading = false;
        }
      );
  }
  addData() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    let newnormatividad: normatividad = {
      contenido: this.contenido?.value,
      id_tipo: this.id_tipo?.value,
      nombre: this.nombre?.value,
      fecha: '',
      url_descarga: this.url_descarga?.value,
    };
    this.normatividadService.addNormatividad(newnormatividad).subscribe(
      (response) => {
        this.loading = false;
        this.goBack();
      },
      (err) => {
        console.log(err);
        this.goBack();
        this.loading = false;
      }
    );
  }
  editarData(normatividad: any) {
    this.form.enable();
    this.normatividad = normatividad;
    this.modalMode = 'update';
    this.prepareForm();
  }
  goBack() {
    this.platformLocation.back();
  }

  get nombre() {
    return this.form.get('nombre');
  }
  get contenido() {
    return this.form.get('contenido');
  }
  get id_tipo() {
    return this.form.get('id_tipo');
  }
/*   get fecha() {
    return this.form.get('fecha');
  } */
  get url_descarga() {
    return this.form.get('url_descarga');
  }
}
