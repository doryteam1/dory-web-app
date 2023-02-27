import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { DatePipe, formatDate, Location, PlatformLocation } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

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
    direccion: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    informacion_adicional_direccion: new FormControl(''),
    fecha_renovacion_camarac: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
    foto_camarac: new FormControl('', [Validators.required]),
    url_rut: new FormControl(''),
    id_tipo_asociacion_fk: new FormControl('', [Validators.required]),
  });
  tiposAsociaciones: any[] = [];
  departamentos: any;
  municipios: any;
  fileRut: any = null;
  urls: any[] = [];
  hasDocument: boolean = false;
  verifyTypeAssociation: any;
  recargarComponen: number = 0;
  nitAsociacion: any;
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
    let action = this.ar.snapshot.paramMap.get('action');
    this.formState = this.ar.snapshot.paramMap.get('formState')!;
    if (action == 'create') {
      this.modalMode = action;
      this.form.reset();
      this.loadDptos();
      this.loadTiposAsociaciones('create');
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
      console.log('Not valid!');
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
                    .update(nit, updatedAsociacion)
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
  addAsociaciones() {
    this.loading1 = true;
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.fotoCamc?.setValidators([Validators.required]);
    this.fotoCamc?.updateValueAndValidity();
    let ext = this.file.name.split('.')[1];
    let token = localStorage.getItem('token');
    let basePath = '/asociaciones/camaracomercio/todas/';
    let fileName = 'camc-asociacion-' + this.form.getRawValue().nit + '.' + ext;
    let filePath = basePath + fileName;
    this.storage
      .cloudStorageTask(filePath, this.file)
      .percentageChanges()
      .subscribe((response) => {
        if (response == 100) {
          //porcentaje de carga de la camara de comercio
          this.storage
            .cloudStorageRef(filePath)
            .getDownloadURL()
            .subscribe(
              (downloadUrl) => {
                let asociacion = { ...this.form.getRawValue() };
                asociacion.legalconstituida = 0;
                asociacion.foto_camarac = downloadUrl;
                this.sendAsociacionToAdd(asociacion);
              },
              (err) => {
                this.loading1 = false;
                //this.error = 'A ocurrido un error al subir la camara de comercio'
                console.log(err);
              }
            );
        }
      });
  }

  async sendAsociacionToAdd(asociacion: any) {
    if (this.fileRut == null) {
      //No hay archivo rut para subir
      this.asociacionesService.add(asociacion).subscribe(
        (response) => {
          this.UpdatedRouter(response.body.message.nit);
        },
        (err) => {
          this.loading1 = false;
          console.log(err);
          if (err.status == 400) {
            this.error = err.error.message;
          } else {
            this.error = 'A ocurrido un error';
          }
        }
      );
    } else {
      let ext = this.fileRut.name.split('.')[1];
      let basePath = '/asociaciones/rut/todos/';
      let fileName =
        'rut-asociacion-' + this.form.getRawValue().nit + '.' + ext;
      let filePath = basePath + fileName;
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
                  asociacion.url_rut = downloadUrl;
                  this.asociacionesService.add(asociacion).subscribe(
                    (response) => {
                      this.UpdatedRouter(response.body.message.nit);
                    },
                    (err) => {
                      this.loading1 = false;
                      console.log(err);
                      if (err.status == 400) {
                        this.error = err.error.message;
                      } else {
                        this.error = 'A ocurrido un error';
                      }
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
  UpdatedRouter(nit: any) {
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

  loadTiposAsociaciones(action: any) {
    this.asociacionesService.tiposAsociacion().subscribe(
      (response) => {
        for (let index = 0; index < response.data.length; index++) {
          response.data[index].status = 1;
        }
        this.tiposAsociaciones = response.data;
        if (action == 'update') {
          if (
            this.asociacion.count_pescadores != 0 &&
            this.asociacion.count_piscicultores != 0
          ) {
            this.tiposAsociaciones[0].status = 0;
            this.tiposAsociaciones[1].status = 0;
          } else if (this.asociacion.count_pescadores != 0) {
            this.tiposAsociaciones[0].status = 0;
          } else if (this.asociacion.count_piscicultores != 0) {
            this.tiposAsociaciones[1].status = 0;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
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
      tipo_asociacion: this.asociacion.id_tipo_asociacion_fk,
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
    this.location.back();
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
      for (let index = 0; index < this.tiposAsociaciones.length; index++) {
        this.tiposAsociaciones[index].status = 1;
      }
      if (
        this.asociacion.count_pescadores != 0 &&
        this.asociacion.count_piscicultores != 0
      ) {
        this.tiposAsociaciones[0].status = 0;
        this.tiposAsociaciones[1].status = 0;
      } else if (this.asociacion.count_pescadores != 0) {
        this.tiposAsociaciones[0].status = 0;
      } else if (this.asociacion.count_piscicultores != 0) {
        this.tiposAsociaciones[1].status = 0;
      }
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
