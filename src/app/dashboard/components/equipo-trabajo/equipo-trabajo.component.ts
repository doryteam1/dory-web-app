import { formatDate, PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { EquipoTrabajoService } from 'src/app/services/equipo-trabajo.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
  selector: 'app-equipo-trabajo',
  templateUrl: './equipo-trabajo.component.html',
  styleUrls: ['./equipo-trabajo.component.scss'],
})
export class EquipoTrabajoComponent implements OnInit {
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  form: FormGroup = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    cargo: new FormControl('', [Validators.required]),
    enlaceCvLAC: new FormControl(''),
    enlaceLinkedin: new FormControl(''),
  });
  equipoTrabajo: any[] = [];
  loading: boolean = false;
  modalMode: string = 'visualize';
  fotoMiembro: any;
  fotoMiembroFinal: any[] = [];
  fotoAmandar: string = '';
  file: any = null;
  miembro: any;
  showError: boolean = false;
  showNotFound: boolean = false;
  constructor(
    private equipoTrabajoService: EquipoTrabajoService,
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private compressImageSizeService: CompressImageSizeService,
    private sanitizer: DomSanitizer,
    private appModalService: AppModalService
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    this.cargaService();
  }
  cargaService() {
    this.equipoTrabajoService.getMiembrosEquipo().subscribe(
      (response) => {
        console.log(response);
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
      this.fotoMiembro = this.miembro?.imagen;
      if (this.miembro?.fecha_nacimiento) {
        fechaNaci = this.miembro?.fecha_nacimiento as string;
        fechaNaci = fechaNaci.split('T')[0];
      }
      this.fecha_nacimiento?.setValue(
        formatDate(fechaNaci, 'yyyy-MM-dd', 'es')
      );
      this.miembro?.arrayEnlaces.forEach((enlace: any) => {
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
    const element: HTMLElement = this.inputFileDialogCreate.nativeElement;
    element.click();
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
        let fileNameBase = '/equipo-trabajo';
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
    let url: any[] = [];
    let foto: string = '';
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    await this.loadPhotos();
    if (this.enlaceCvLAC?.value) {
      url.push(this.enlaceCvLAC?.value);
    }
    if (this.enlaceLinkedin?.value) {
      url.push(this.enlaceLinkedin?.value);
    }
    if (this.fotoAmandar) {
      foto = this.fotoAmandar;
    } else {
      foto = this.miembro.imagen;
    }
    let newMembroEquipo = {
      nombres: this.nombres?.value,
      apellidos: this.apellidos?.value,
      descripcion: this.descripcion?.value,
      imagen: foto,
      fecha_nacimiento: this.fecha_nacimiento?.value,
      cargo: this.cargo?.value,
      arrayEnlaces: url,
    };
    console.log(newMembroEquipo);
    this.equipoTrabajoService
      .updateMiembroEquipo(this.miembro.id, newMembroEquipo)
      .subscribe(
        (response) => {
          this.loading = false;
          this.goBack();
        },
        (err) => {
          this.goBack();
          this.loading = false;
        }
      );
  }
  async addMiembro() {
    this.loading = true;
    let url: any[] = [];
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    await this.loadPhotos();
    if (this.enlaceCvLAC?.value) {
      url.push(this.enlaceCvLAC?.value);
    }
    if (this.enlaceLinkedin?.value) {
      url.push(this.enlaceLinkedin?.value);
    }
    let newMembroEquipo = {
      nombres: this.nombres?.value,
      apellidos: this.apellidos?.value,
      descripcion: this.descripcion?.value,
      imagen: this.fotoAmandar,
      fecha_nacimiento: this.fecha_nacimiento?.value,
      cargo: this.cargo?.value,
      arrayEnlaces: url,
    };
    console.log(newMembroEquipo);
    this.equipoTrabajoService.addMiembroEquipo(newMembroEquipo).subscribe(
      (response) => {
        this.miembro = newMembroEquipo;
        console.log(response);
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
  deleteMiembro(id: any, nombre: any, idx: any) {
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
          this.equipoTrabajoService.deleteMiembroEquipo(id).subscribe(
            (response) => {
              this.equipoTrabajo.splice(idx, 1);
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
  editarData(miembro: any) {
    this.form.enable();
    this.miembro = miembro;
    this.modalMode = 'update';
    this.prepareForm();
  }
  goBack() {
    this.form.disable();
    this.modalMode = 'visualize';
    this.cargaService();
    this.prepareForm();
  }

  openFormCrear() {
    this.form.enable();
    this.modalMode = 'create';
    this.prepareForm();
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
}
