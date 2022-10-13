import {
  formatDate,
  PlatformLocation,
  registerLocaleData,
} from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { EquipoTrabajoService } from 'src/app/services/equipo-trabajo.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
interface equipotrabajo {
  id?: number /* no */;
  nombres: string;
  apellidos: string;
  descripcion: string;
  imagen: string;
  fecha_nacimiento: Date;
  cargo: string;
  municipio: string;
  departamento: string;
  pais: string;
  url_enlace?: string /* no */;
  arrayEnlaces: string[];
}
@Component({
  selector: 'app-equipo-trabajo-detalle-form',
  templateUrl: './equipo-trabajo-detalle-form.component.html',
  styleUrls: ['./equipo-trabajo-detalle-form.component.scss'],
})
export class EquipoTrabajoDetalleFormComponent implements OnInit {
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  form: FormGroup = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    cargo: new FormControl('', [Validators.required]),
    enlaceCvLAC: new FormControl(''),
    enlaceLinkedin: new FormControl(''),
    pais: new FormControl('', [Validators.required]),
    departamento: new FormControl('', [Validators.required]),
    municipio: new FormControl('', [Validators.required]),
  });
  loading: boolean = false;
  modalMode: string = 'visualize';
  fotoMiembro: any;
  fotoMiembroFinal: any[] = [];
  fotoAmandar: string = '';
  file: any = null;
  miembro!: equipotrabajo;
  idMiembro: number = -1;
  authUserId: number = -1;
  enlacesArray: any[] = [];
  constructor(
    private equipoTrabajoService: EquipoTrabajoService,
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private compressImageSizeService: CompressImageSizeService,
    private sanitizer: DomSanitizer,
    private ar: ActivatedRoute
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let idMiembro = Number(this.ar.snapshot.paramMap.get('id'));
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    if (this.modalMode == 'update') {
      this.equipoTrabajoService.getMiembrosEquipo().subscribe(
        (response) => {
          let index = response.data.findIndex(
            (miembro: equipotrabajo) => miembro.id == idMiembro
          );
          this.miembro = response.data[index];
          this.idMiembro = this.miembro.id!;
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
      this.nombres?.setValue('');
      this.apellidos?.setValue('');
      this.descripcion?.setValue('');
      this.fecha_nacimiento?.setValue('');
      this.cargo?.setValue('');
      this.enlaceLinkedin?.setValue('');
      this.enlaceCvLAC?.setValue('');
      this.pais?.setValue('');
      this.departamento?.setValue('');
      this.municipio?.setValue('');
      this.fotoMiembro = '';
      this.fotoMiembroFinal = [];
      this.loading = false;
      this.fotoAmandar = '';
    }
    if (this.modalMode == 'update') {
      let fechaNaci: string = '';
      this.nombres?.setValue(this.miembro?.nombres);
      this.apellidos?.setValue(this.miembro?.apellidos);
      this.descripcion?.setValue(this.miembro?.descripcion);
      this.cargo?.setValue(this.miembro?.cargo);
      this.pais?.setValue(this.miembro?.pais);
      this.departamento?.setValue(this.miembro?.departamento);
      this.municipio?.setValue(this.miembro?.municipio);
      this.fotoMiembro = this.miembro?.imagen;
      if (this.miembro?.fecha_nacimiento) {
        fechaNaci = this.miembro?.fecha_nacimiento as unknown as string;
        fechaNaci = fechaNaci.split('T')[0];
        this.fecha_nacimiento?.setValue(
          formatDate(fechaNaci, 'yyyy-MM-dd', 'es')
        );
      }
      this.miembro.arrayEnlaces?.forEach((enlace: string) => {
        if (enlace?.includes('linkedin')) {
          this.enlaceLinkedin?.setValue(enlace);
        }
        if (enlace?.includes('cvlac')) {
          this.enlaceCvLAC?.setValue(enlace);
        }
      });
    }
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  openAddFileDialogCreate() {
    if (!this.loading) {
      const element: HTMLElement = this.inputFileDialogCreate.nativeElement;
      element.click();
    }
  }
  fileChangeCreate(event: any) {
    let previewImageCreate: SafeUrl = '';
    this.file = event.target.files[0];
    let objectURL = URL.createObjectURL(this.file);
    previewImageCreate = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.fotoMiembro = previewImageCreate;
    this.fotoMiembroFinal = [this.file];
    event.srcElement.value = '';
  }

  async loadPhotos() {
    try {
      if (this.fotoMiembroFinal.length != 0) {
        const compressedFile =
          await this.compressImageSizeService.handleImageUpload(
            this.fotoMiembroFinal[0]
          );
        let fileNameBase = 'equipotrabajo/equipo-trabajo';
        let file: any = compressedFile;
        let nowTimestamp = new Date().getTime().toString();
        await this.storage
          .cloudStorageTask(fileNameBase + nowTimestamp, file)
          .percentageChanges()
          .toPromise();
        let downloadUrl = await this.storage
          .cloudStorageRef(fileNameBase + nowTimestamp)
          .getDownloadURL()
          .toPromise();
        this.fotoAmandar = downloadUrl;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async updateData() {
    this.loading = true;
    let enlaces: any = {
      arrayEnlaces: [],
    };
    let foto: string = '';
    let urlFoto = this.miembro.imagen;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    await this.loadPhotos();
    if (this.enlaceCvLAC?.value) {
      enlaces.arrayEnlaces.push(this.enlaceCvLAC?.value);
    }
    if (this.enlaceLinkedin?.value) {
      enlaces.arrayEnlaces.push(this.enlaceLinkedin?.value);
    }
    if (this.fotoAmandar && urlFoto.includes('firebasestorage')) {
      console.log('Foto eliminada de firebase');
      this.storage.deleteByUrl(urlFoto);
    }
    if (this.fotoAmandar) {
      console.log('Foto cargada de firebase');
      foto = this.fotoAmandar;
    } else {
      console.log('Foto cargada de DB');
      foto = this.miembro.imagen;
    }
    let newMembroEquipo: equipotrabajo = {
      nombres: this.nombres?.value,
      apellidos: this.apellidos?.value,
      descripcion: this.descripcion?.value,
      imagen: foto,
      fecha_nacimiento: this.fecha_nacimiento?.value,
      cargo: this.cargo?.value,
      pais: this.pais?.value,
      departamento: this.departamento?.value,
      municipio: this.municipio?.value,
      arrayEnlaces: enlaces.arrayEnlaces,
    };
    this.equipoTrabajoService
      .updateMiembroEquipo(this.idMiembro, newMembroEquipo)
      .subscribe(
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
  async addMiembro() {
    this.loading = true;
    let enlaces: any = {
      arrayEnlaces: [],
    };
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    await this.loadPhotos();
    if (this.enlaceCvLAC?.value) {
      enlaces.arrayEnlaces.push(this.enlaceCvLAC?.value);
    }
    if (this.enlaceLinkedin?.value) {
      enlaces.arrayEnlaces.push(this.enlaceLinkedin?.value);
    }
    let newMembroEquipo: equipotrabajo = {
      nombres: this.nombres?.value,
      apellidos: this.apellidos?.value,
      descripcion: this.descripcion?.value,
      imagen: this.fotoAmandar,
      fecha_nacimiento: this.fecha_nacimiento?.value,
      cargo: this.cargo?.value,
      pais: this.pais?.value,
      departamento: this.departamento?.value,
      municipio: this.municipio?.value,
      arrayEnlaces: enlaces.arrayEnlaces,
    };
    this.equipoTrabajoService.addMiembroEquipo(newMembroEquipo).subscribe(
      (response) => {
        this.loading = false;
        this.goBack();
      },
      (err) => {
        console.log(err);
        this.loading = false;
        this.goBack();
      }
    );
  }
  editarData(miembro: any) {
    this.form.enable();
    this.miembro = miembro;
    this.modalMode = 'update';
    this.prepareForm();
  }
  goBack() {
    this.platformLocation.back();
  }
  get fechaActual() {
    var today = new Date();
    var now = today.toLocaleDateString('es');
    now = formatDate(now, 'yyyy-MM-dd', 'es');
    return now;
  }
  get nombres() {
    return this.form.get('nombres');
  }
  get apellidos() {
    return this.form.get('apellidos');
  }
  get descripcion() {
    return this.form.get('descripcion');
  }
  get cargo() {
    return this.form.get('cargo');
  }
  get fecha_nacimiento() {
    return this.form.get('fecha_nacimiento');
  }
  get enlaceCvLAC() {
    return this.form.get('enlaceCvLAC');
  }
  get enlaceLinkedin() {
    return this.form.get('enlaceLinkedin');
  }
  get pais() {
    return this.form.get('pais');
  }
  get departamento() {
    return this.form.get('departamento');
  }
  get municipio() {
    return this.form.get('municipio');
  }
}
