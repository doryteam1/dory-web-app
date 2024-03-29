import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import {
  DatePipe,
  formatDate,
  Location,
  PlatformLocation,
} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { WhiteSpaceValidator } from 'src/app/validators/white-space.validator';
@Component({
  selector: 'app-asociacion-detalle-form',
  templateUrl: './asociacion-detalle-form.component.html',
  styleUrls: ['./asociacion-detalle-form.component.scss'],
})
export class AsociacionDetalleFormComponent implements OnInit {
  formState = 'enable';
  loading1: boolean = false;
  modalMode: string = 'update';
  asociacion: any;
  file: any = null;
  error: string = '';
  previousValue: number = 0;
  form: FormGroup = new FormGroup({
    nit: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required, WhiteSpaceValidator]),
    telefono: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, WhiteSpaceValidator]),
    informacion_adicional_direccion: new FormControl(''),
    fecha_renovacion_camarac: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
    foto_camarac: new FormControl(''),
    url_rut: new FormControl(''),
    id_tipo_asociacion_fk: new FormControl('', [Validators.required]),
  });
  tiposAsociaciones: any[] = [
    {
      id_tipo_asociacion: 1,
      nombre: 'Piscicultores',
      status: 1,
    },
    {
      id_tipo_asociacion: 2,
      nombre: 'Pescadores',
      status: 1,
    },
    {
      id_tipo_asociacion: 3,
      nombre: 'Mixta',
      status: 1,
    },
  ];
  departamentos: any;
  municipios: any;
  fileRut: any = null;
  urls: any[] = [];
  hasDocument: boolean = false;
  verifyTypeAssociation: any;
  recargarComponen: number = 0;
  nitAsociacion: any;
  authUserTipo: string = '';
  constructor(
    private asociacionesService: AsociacionesService,
    private storage: FirebaseStorageService,
    private places: PlacesService,
    private ar: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private utilitiesService: UtilitiesService,
    private router: Router,
    private appModalService: AppModalService,
    public platformLocation: PlatformLocation
  ) {}

  ngOnInit(): void {
    this.loadNgOnlnit();
    this.platformLocation.onPopState((even: any) => {
      this.appModalService.closeModal();
      /* this.router.navigate(['/dashboard/mis-asociaciones']); */
    });
  }

  loadNgOnlnit() {
    registerLocaleData(es);
    let action = this.ar.snapshot.paramMap.get('action')!;
    this.formState = this.ar.snapshot.paramMap.get('formState')!;
    this.authUserTipo = this.ar.snapshot.paramMap.get('authUserTipo')!;
    if (action == 'create') {
      this.modalMode = action;
      this.form.reset();
      this.loadDptos();
      this.loadTiposAsociaciones(this.modalMode);
    } else {
      let nit: any = this.ar.snapshot.paramMap.get('nit');
      this.nitAsociacion = nit;
      this.asociacionesService
        .getAsociacionDetalle(nit)
        .subscribe((response) => {
          this.asociacion = response.data[0];
          this.prepareForm();
          this.loadDptos();
          this.loadTiposAsociaciones('update');
        });
      this.asociacionesService.getMiembrosPrivado(nit).subscribe((response) => {
        let representante = response.data.representante;
        let miembros = response.data.miembros;
        if (representante.url_imagen_cedula || representante.url_sisben) {
          this.hasDocument = true;
        } else {
          let index = miembros.findIndex((miembro: any) => {
            if (miembro.url_imagen_cedula || miembro.url_sisben) {
              return true;
            } else {
              return false;
            }
          });
          if (index > -1) {
            this.hasDocument = true;
          } else {
            this.hasDocument = false;
          }
        }
      });
    }
  }

  async updateAsociacion() {
    this.loading1 = true;
    if (
      this.asociacion.foto_camarac &&
      this.asociacion.foto_camarac != 'null'
    ) {
      this.fotoCamc?.clearValidators();
      this.fotoCamc?.updateValueAndValidity();
      //Se quitaron los validadores de la foto camara comercio
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.fotoCamc?.setValidators([Validators.required]);
    this.fotoCamc?.updateValueAndValidity();
    if (this.fotoCamc?.invalid) {
      //No cargó un nuevo archivo de camara de comercio
      let updatedAsociacion = { ...this.form.getRawValue() };
      updatedAsociacion.foto_camarac = this.asociacion.foto_camarac;
      this.sendAsociacionUpdated(updatedAsociacion, this.asociacion.nit);
    } else {
      let ext = this.file.name.split('.')[1];
      let basePath = '/asociaciones/camaracomercio/todas/';
      let fileName =
        'camc-asociacion-' + this.form.getRawValue().nit + '.' + ext;
      let filePath = basePath + fileName;
      try {
        await this.storage
          .deleteByUrl(this.asociacion?.foto_camarac)
          .toPromise();
      } catch (err) {
        try {
          await this.storage
            .deleteByUrl(this.asociacion?.foto_camarac)
            .toPromise();
        } catch (err) {}
      }
      this.storage
        .cloudStorageTask(filePath, this.file)
        .percentageChanges()
        .subscribe((response) => {
          if (response == 100) {
            this.storage
              .cloudStorageRef(filePath)
              .getDownloadURL()
              .subscribe(
                (downloadUrl) => {
                  let updatedAsociacion = { ...this.form.getRawValue() };
                  updatedAsociacion.foto_camarac = downloadUrl;
                  updatedAsociacion.url_rut = this.asociacion.url_rut;
                  this.sendAsociacionUpdated(
                    updatedAsociacion,
                    this.asociacion.nit
                  );
                },
                (err) => {
                  this.loading1 = false;
                  console.log(err);
                  //this.error = 'A ocurrido un error al subir la camara de comercio'
                }
              );
          }
        });
    }
  }
  async sendAsociacionUpdated(updatedAsociacion: any, nit: number) {
    if (this.fileRut == null) {
      //No hay archivo rut para subir

      this.asociacionesService.updateParcial(nit, updatedAsociacion).subscribe(
        (response) => {
          this.onAsociacionDetalles(nit, 'update');
          this.loading1 = false;
        },
        (err) => {
          console.log(err);
          this.loading1 = false;
        }
      );
    } else {
      let ext = this.fileRut.name.split('.')[1];
      let basePath = '/asociaciones/rut/todos/';
      let fileName =
        'rut-asociacion-' + this.form.getRawValue().nit + '.' + ext;
      let filePath = basePath + fileName;
      try {
        await this.storage.deleteByUrl(this.asociacion?.url_rut).toPromise();
      } catch (err) {
        try {
          await this.storage.deleteByUrl(this.asociacion?.url_rut).toPromise();
        } catch (err) {}
      }
      this.storage
        .cloudStorageTask(filePath, this.fileRut)
        .percentageChanges()
        .subscribe((response) => {
          if (response == 100) {
            this.storage
              .cloudStorageRef(filePath)
              .getDownloadURL()
              .subscribe(
                (downloadUrl) => {
                  updatedAsociacion.url_rut = downloadUrl;
                  this.asociacionesService
                    .updateParcial(nit, updatedAsociacion)
                    .subscribe(
                      (response) => {
                        this.onAsociacionDetalles(nit, 'update');
                        this.loading1 = false;
                      },
                      (err) => {
                        console.log(err);
                        this.loading1 = false;
                      }
                    );
                },
                (err) => {
                  this.loading1 = false;
                  console.log(err);
                  //this.error = 'A ocurrido un error al subir el documento RUT';
                }
              );
          }
        });
    }
  }

  /*   async addAsociaciones() {
    this.loading1 = true;

    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    let asociacion = { ...this.form.getRawValue() };
    if (!this.file && !this.fileRut) {
      console.log('sin rut ni camara');
      // No hay archivo rut ni cámara para subir
      asociacion.legalconstituida = 0;
      this.addAsociacion(asociacion);
    } else if (this.file && this.fileRut) {
      console.log('camarra y rut ');
      try {
        this.fotoCamc?.setValidators([Validators.required]);
        this.fotoCamc?.updateValueAndValidity();
        asociacion.foto_camarac = await this.camaraComercioUrlStorage();
        asociacion.url_rut = await this.rutUrlStorage();
        asociacion.legalconstituida = 0;
        this.addAsociacion(asociacion);
      } catch (error: any) {
        this.loading1 = false;
        console.log(error);
        this.error =
          'Ha ocurrido un error al subir los documentos, por favor inténtalo de nuevo';
      }
    } else if (this.file && !this.fileRut) {
      console.log('camarra ');
      try {
        this.fotoCamc?.setValidators([Validators.required]);
        this.fotoCamc?.updateValueAndValidity();
        asociacion.foto_camarac = await this.camaraComercioUrlStorage();
        asociacion.legalconstituida = 0;
        this.addAsociacion(asociacion);
      } catch (error: any) {
        this.loading1 = false;
        console.log(error);
        this.error =
          'Ha ocurrido un error al subir el documento de la cámara de comercio, por favor inténtalo de nuevo';
      }
    } else if (!this.file && this.fileRut) {
      console.log(' rut ');
      try {
        asociacion.url_rut = await this.rutUrlStorage();
        asociacion.legalconstituida = 0;
        this.addAsociacion(asociacion);
      } catch (error: any) {
        this.loading1 = false;
        console.log(error);
        this.error =
          'Ha ocurrido un error al subir el documento del rut, por favor inténtalo de nuevo';
      }
    }
  }

  async camaraComercioUrlStorage() {
    try {
      let ext = this.file.name.split('.')[1];
      let basePath = '/asociaciones/camaracomercio/todas/';
      let fileName =
        'camc-asociacion-' + this.form.getRawValue().nit + '.' + ext;
      let filePath = basePath + fileName;

      const percentageChanges = this.storage
        .cloudStorageTask(filePath, this.file)
        .percentageChanges()
        .toPromise();
      const response = await percentageChanges;

      if (response === 100) {
        const downloadUrl = await this.storage
          .cloudStorageRef(filePath)
          .getDownloadURL()
          .toPromise();
        return downloadUrl;
      } else {
        throw new Error(
          'No se pudo completar la carga de la cámara de comercio.'
        );
      }
    } catch (err) {
      this.loading1 = false;
      console.error(
        'Ha ocurrido un error al subir la cámara de comercio:',
        err
      );
      throw err; // Propaga el error para que se pueda manejar en el contexto que llama a esta función.
    }
  }

  async rutUrlStorage() {
    try {
      let ext = this.fileRut.name.split('.')[1];
      let basePath = '/asociaciones/rut/todos/';
      let fileName =
        'rut-asociacion-' + this.form.getRawValue().nit + '.' + ext;
      let filePath = basePath + fileName;

      const percentageChanges = this.storage
        .cloudStorageTask(filePath, this.fileRut)
        .percentageChanges()
        .toPromise();
      const response = await percentageChanges;

      if (response === 100) {
        const downloadUrl = await this.storage
          .cloudStorageRef(filePath)
          .getDownloadURL()
          .toPromise();
        return downloadUrl;
      } else {
        throw new Error('No se pudo completar la carga del rut.');
      }
    } catch (err) {
      this.loading1 = false;
      console.error('Ha ocurrido un error al subir el rut:', err);
      throw err; // Propaga el error para que se pueda manejar en el contexto que llama a esta función.
    }
  } */

  async addAsociaciones() {
    try {
      this.loading1 = true;

      if (!this.form.valid) {
        console.log('Not valid!');
        this.form.markAllAsTouched();
        this.loading1 = false;
        return;
      }

      let asociacion = { ...this.form.getRawValue() };
      asociacion.legalconstituida = 0;
      asociacion.foto_camarac = null;
      asociacion.url_rut = null;
      let asociacionUpdate: any = {};

      /*  */
      if (this.file && this.fileRut) {
        await this.addAsociacion(asociacion);
        asociacionUpdate.foto_camarac = await this.uploadFileToStorage(
          this.file,
          '/asociaciones/camaracomercio/todas/',
          'camc-asociacion-'
        );
        asociacionUpdate.url_rut = await this.uploadFileToStorage(
          this.fileRut,
          '/asociaciones/rut/todos/',
          'rut-asociacion-'
        );
        await this.actualizarParcialAsociacion(asociacionUpdate);
      } else if (this.file) {
        await this.addAsociacion(asociacion);
        asociacionUpdate.foto_camarac = await this.uploadFileToStorage(
          this.file,
          '/asociaciones/camaracomercio/todas/',
          'camc-asociacion-'
        );
        await this.actualizarParcialAsociacion(asociacionUpdate);
      } else if (this.fileRut) {
        await this.addAsociacion(asociacion);
        asociacionUpdate.url_rut = await this.uploadFileToStorage(
          this.fileRut,
          '/asociaciones/rut/todos/',
          'rut-asociacion-'
        );
        await this.actualizarParcialAsociacion(asociacionUpdate);
      } else {
        await this.addAsociacion(asociacion);
         this.UpdatedRouter(this.form.getRawValue().nit);
      }
    } catch (error: any) {
      this.loading1 = false;
      console.log(error);

      if (error.status ==400 || error.status == 401) {
        this.error = error.error.message;
         setTimeout(() => {
           this.error = '';
         }, 6000);
        return
      }


      if (error.message == 'ERR_FILE') {
        this.file=null;
        this.fileRut=null;
        this.UpdatedRouter(this.form.getRawValue().nit);
        this.error =
          'No se pudo completar la carga del archivo, por favor inténtalo de nuevo';
        setTimeout(() => {
          this.error=''
        }, 6000);
      }else {
        this.error = 'Ha ocurrido un error, por favor inténtalo de nuevo';
         setTimeout(() => {
           this.error = '';
         }, 6000);
      }
    }
  }

  async uploadFileToStorage(
    file: File,
    basePath: string,
    fileBase: string
  ): Promise<string> {
    try {
      const ext = file.name.split('.')[1];
      const fileName = fileBase + this.form.getRawValue().nit + '.' + ext;
      const filePath = basePath + fileName;

      const percentageChanges = this.storage
        .cloudStorageTask(filePath, file)
        .percentageChanges()
        .toPromise();
      const response = await percentageChanges;
      if (response === 100) {
        const downloadUrl = await this.storage
          .cloudStorageRef(filePath)
          .getDownloadURL()
          .toPromise();
        return downloadUrl;
      } else {
        throw new Error(
          'ERR_FILE'
        );
      }
    } catch (err) {
      console.error('Ha ocurrido un error al subir el archivo:', err);
       throw new Error(
          'ERR_FILE'
        );
        // Propagate the error to be handled in the calling context.
    }
  }

  async addAsociacion(asociacion: any): Promise<any> {
    try {
      return await this.asociacionesService.add(asociacion).toPromise();
    } catch (err: any) {
      console.log(err);
      throw err; // Propagate the error to be handled in the calling context.
    }
  }

  async actualizarParcialAsociacion(updateAsociacion: any): Promise<any> {
    try {
      await this.asociacionesService
        .updateParcial(this.form.getRawValue().nit, updateAsociacion)
        .toPromise();
      this.UpdatedRouter(this.form.getRawValue().nit);
    } catch (err) {
      console.log(err);
      throw err; // Propagate the error to be handled in the calling contex
    }
  }



  UpdatedRouter(nit: any) {
    console.log('paracial');
    if (nit) {
      let object: any = {};
      (object.nit = nit),
        (object.action = 'update'),
        (object.formState = 'enable'),
        this.router
          .navigate(['/dashboard/asociacion/detalle', object])
          .then((value: any) => {
            if (value) {
              this.loadNgOnlnit();
            }
            this.loading1 = false;
          });
    } else {
      this.loading1 = false;
    }
  }

  fileChange(event: any) {
    this.file = event.target.files[0];
  }

  fileRutChange(event: any) {
    this.fileRut = event.target.files[0];
  }
  loadTiposAsociaciones(action: string) {
    const isPiscicultor = this.authUserTipo === 'Piscicultor';

    if (isPiscicultor) {
      this.tiposAsociaciones[1].status = 0; // pescadores disabled
    } else {
      this.tiposAsociaciones[0].status = 0; // piscicultores disabled
    }

    if (action === 'update') {
      const hasPescadores = this.asociacion.count_pescadores !== 0;
      const hasPiscicultores = this.asociacion.count_piscicultores !== 0;

      if (isPiscicultor) {
        this.tiposAsociaciones[0].status =
          hasPescadores && hasPiscicultores ? 0 : hasPescadores ? 0 : 1;
      } else {
        this.tiposAsociaciones[1].status =
          hasPescadores && hasPiscicultores ? 0 : hasPiscicultores ? 0 : 1;
      }
    }
  }

  loadDptos() {
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.departamentos = response.data;
        this.idDpto?.setValue(70);
        this.idDpto?.disable();
        this.loadMunic();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadMunic() {
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response) => {
        this.municipios = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeDpto() {
    this.form.get('id_municipio')?.setValue(0);
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response) => {
        this.municipios = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  verMiembros() {
    let datosAsociacion: any = {
      nit: this.asociacion.nit,
      tipo_asociacion: this.asociacion.id_tipo_asociacion_fk,
    };
    this.asociacionesService
      .showAscociacionMiembrosModal(datosAsociacion, 'Miembros')
      .then((result) => {
        this.onAsociacionDetalles(this.nitAsociacion, 'update');
      })
      .catch((result) => {
        this.onAsociacionDetalles(this.nitAsociacion, 'update');
      });
  }
  agregarMiembro() {
    let datosAsociacion: any = {
      nit: this.asociacion.nit,
      tipo_asociacion: this.asociacion?.id_tipo_asociacion_fk,
    };
    this.asociacionesService
      .showSolicitudesModal(datosAsociacion, 'Agregar miembro')
      .then((result) => {
        this.onAsociacionDetalles(this.nitAsociacion, 'update');
      })
      .catch((result) => {
        this.onAsociacionDetalles(this.nitAsociacion, 'update');
      });
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  prepareForm() {
    this.modalMode = 'update';
    this.form.reset();
    this.idDpto?.setValue(this.asociacion.id_departamento);
    this.idMunic?.setValue(this.asociacion.id_municipio);
    this.nit?.setValue(this.asociacion.nit);
    this.direccion?.setValue(this.asociacion.direccion);
    this.infoAdicionalDir?.setValue(
      this.asociacion.informacion_adicional_direccion
    );
    this.nombre?.setValue(this.asociacion.nombre);
    this.telefono?.setValue(this.asociacion.telefono);
    let fechaRenv: string = '';
    if (this.asociacion?.fecha_renovacion_camarac) {
      fechaRenv = this.asociacion?.fecha_renovacion_camarac as string;
      fechaRenv = fechaRenv.split('T')[0];
    }
    this.fechRenvCamc?.setValue(formatDate(fechaRenv, 'yyyy-MM-dd', 'es'));
    this.idTipoAsoc?.setValue(this.asociacion.id_tipo_asociacion_fk);
    this.corregVereda?.setValue(this.asociacion.corregimiento_vereda);
    this.direccion?.setValue(this.asociacion.direccion);
    this.nit?.disable();
    if (this.formState == 'disable') {
      this.form.disable();
    }
  }
  goBack() {
    this.router.navigateByUrl('/dashboard/mis-asociaciones');
    /*  this.location.back(); */
  }
  download() {
    try {
      this.asociacionesService
        .getMiembrosPrivado(this.asociacion.nit)
        .subscribe(async (response) => {
          let representante = response.data.representante;
          let miembros = response.data.miembros;
          if (representante) {
            if (representante.url_imagen_cedula) {
              let cedulaBase64 = await this.utilitiesService.urlToBase64(
                representante.url_imagen_cedula
              );
              let metaCedula = await this.storage
                .refFromUrl(representante.url_imagen_cedula)
                .getMetadata()
                .toPromise();
              this.urls.push({
                data:
                  'cedulas/cedula-rep-' +
                  representante.nombres.replace(/\s+/g, '') +
                  '.' +
                  metaCedula.name.split('.')[1],
                url: representante.url_imagen_cedula,
                image: cedulaBase64,
              });
            }

            if (representante.url_sisben) {
              let sisbenBase64 = await this.utilitiesService.urlToBase64(
                representante.url_sisben
              );
              let metaSisben = await this.storage
                .refFromUrl(representante.url_sisben)
                .getMetadata()
                .toPromise();
              this.urls.push({
                data:
                  'sisben/sisben-rep-' +
                  representante.nombres.replace(/\s+/g, '') +
                  '.' +
                  metaSisben.name.split('.')[1],
                url: representante.url_sisben,
                image: sisbenBase64,
              });
            }
          }
          if (miembros) {
            for (let i = 0; i < miembros.length; i++) {
              if (miembros[i].url_imagen_cedula) {
                let cedulaBase64 = await this.utilitiesService.urlToBase64(
                  miembros[i].url_imagen_cedula
                );
                let metaCedula = await this.storage
                  .refFromUrl(miembros[i].url_imagen_cedula)
                  .getMetadata()
                  .toPromise();
                this.urls.push({
                  data:
                    'cedulas/cedula-' +
                    miembros[i].nombres.replace(/\s+/g, '') +
                    '.' +
                    metaCedula.name.split('.')[1],
                  url: miembros[i].url_imagen_cedula,
                  image: cedulaBase64,
                });
              }
              if (miembros[i].url_sisben) {
                let sisbenBase64 = await this.utilitiesService.urlToBase64(
                  miembros[i].url_sisben
                );
                let metaSisben = await this.storage
                  .refFromUrl(miembros[i].url_sisben)
                  .getMetadata()
                  .toPromise();
                this.urls.push({
                  data:
                    'sisben/sisben-' +
                    miembros[i].nombres.replace(/\s+/g, '') +
                    '.' +
                    metaSisben.name.split('.')[1],
                  url: miembros[i].url_sisben,
                  image: sisbenBase64,
                });
              }
            }
          }
          this.utilitiesService.compressFileToZip(this.urls);
        });
    } catch (err) {
      console.log(err);
    }
  }
  eliminarAsociacion() {
    console.log(this.asociacion);
    let url_rut: string = this.asociacion?.url_rut;
    let foto_camarac: string = this.asociacion?.foto_camarac;
    this.appModalService
      .confirm(
        'Eliminar asociación',
        'Esta seguro que desea eliminar esta asociación',
        'Sí',
        'No',
        this.asociacion.nombre
      )
      .then((result) => {
        if (result == true) {
          this.asociacionesService.delete(this.asociacion.nit).subscribe(
            (response: any) => {
              if (url_rut?.length > 0 && url_rut != null) {
                this.storage.deleteByUrl(url_rut);
              }

              if (foto_camarac?.length > 0 && foto_camarac != null) {
                this.storage.deleteByUrl(foto_camarac);
              }
              this.goBack();
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }

  onAsociacionDetalles(nit: any, action: any) {
    this.asociacionesService.getAsociacionDetalle(nit).subscribe((response) => {
      this.asociacion = response.data[0];
      this.loadTiposAsociaciones('update');
    });
  }
  get idDpto() {
    return this.form.get('id_departamento');
  }
  get idMunic() {
    return this.form.get('id_municipio');
  }
  get nit() {
    return this.form.get('nit');
  }
  get direccion() {
    return this.form.get('direccion');
  }
  get infoAdicionalDir() {
    return this.form.get('informacion_adicional_direccion');
  }
  get nombre() {
    return this.form.get('nombre');
  }
  get fechRenvCamc() {
    return this.form.get('fecha_renovacion_camarac');
  }

  get fotoCamc() {
    return this.form.get('foto_camarac');
  }

  get urlRut() {
    return this.form.get('url_rut');
  }

  get idTipoAsoc() {
    return this.form.get('id_tipo_asociacion_fk');
  }

  get corregVereda() {
    return this.form.get('corregimiento_vereda');
  }

  get telefono() {
    return this.form.get('telefono');
  }
  get fechaActual() {
    var today = new Date();
    return this.datePipe.transform(today, 'yyyy-MM-dd');
  }
}
