import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { Utilities } from 'src/app/utilities/utilities';
import { DatePipe, formatDate, Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
    legalconstituida: new FormControl('', [Validators.required]),
    informacion_adicional_direccion: new FormControl(''),
    fecha_renovacion_camarac: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
    foto_camarac: new FormControl('', [Validators.required]),
    url_rut: new FormControl(''),
    id_tipo_asociacion_fk: new FormControl('', [Validators.required]),
  });
  tiposAsociaciones: any;
  departamentos: any;
  municipios: any;
  fileRut: any = null;
  datosAsociacion: any;
  urls: any[] = [];
  hasDocument: boolean = false;
  constructor(
    private asociacionesService: AsociacionesService,
    private storage: FirebaseStorageService,
    private places: PlacesService,
    private ar: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private utilitiesService: UtilitiesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onAsociacionDetalles();
  }
  onAsociacionDetalles() {
    registerLocaleData(es);
    this.asociacion = { ...this.ar.snapshot.params };
    this.datosAsociacion = {
      nit: this.asociacion?.nit,
      tipo_asociacion: this.asociacion.tipo_asociacion,
    };
    let action = this.ar.snapshot.paramMap.get('action');
    console.log(action)
    this.formState = this.ar.snapshot.paramMap.get('formState')!;
    if (action == 'create') {
      this.prepareForm(action!, this.asociacion);
      this.loadDptos();
      this.loadTiposAsociaciones();
      this.onChangeLegalConst();
    } else {
      this.asociacionesService
        .getAsociacionDetalle(this.asociacion.nit)
        .subscribe((response) => {
          let tempAsoc = response.data[0];
          this.asociacion.url_rut = tempAsoc.url_rut;
          this.asociacion.foto_camarac = tempAsoc.foto_camarac;
          if (!this.asociacion.count_miembros) {
            this.asociacion.count_miembros=tempAsoc.count_miembros
          }
          this.prepareForm(action!, this.asociacion);
          this.loadDptos();
          this.loadTiposAsociaciones();
          this.onChangeLegalConst();
        });
    }
    this.idTipoAsoc?.valueChanges.subscribe((value) => {});
    this.asociacionesService
      .getMiembrosPrivado(this.asociacion.nit)
      .subscribe((response) => {
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
  async updateAsociacion() {
    this.loading1 = true;

    if (
      this.isLegalConstituida?.value == '0' ||
      (this.asociacion.foto_camarac && this.asociacion.foto_camarac != 'null')
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
    if (this.fotoCamc?.invalid || this.isLegalConstituida?.value == '0') {
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
          this.loading1 = false;
          this.location.back();
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
                        this.loading1 = false;
                        this.location.back();
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
    if (this.isLegalConstituida?.value == '0') {
      this.fotoCamc?.clearValidators();
      this.fotoCamc?.updateValueAndValidity();
    }
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.fotoCamc?.setValidators([Validators.required]);
    this.fotoCamc?.updateValueAndValidity();

    if (this.isLegalConstituida?.value == '0') {
      let asociacion = { ...this.form.getRawValue() };
      this.sendAsociacionToAdd(asociacion);
    } else {
      let ext = this.file.name.split('.')[1];
      let token = localStorage.getItem('token');
      let payload = Utilities.parseJwt(token!);
      let basePath = '/asociaciones/camaracomercio/todas/';
      let fileName =
        'camc-asociacion-' + this.form.getRawValue().nit + '.' + ext;
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
  }

  async sendAsociacionToAdd(asociacion: any) {
    if (this.fileRut == null) {
      //No hay archivo rut para subir
      this.asociacionesService.add(asociacion).subscribe(
        (response) => {
          if (response.body.message.nit) {
            this.asociacionesService
              .getAsociacionDetalle(response.body.message.nit)
              .subscribe((response) => {
                let asoci= response.data[0];
                let object: any = { ...asoci };
                (object.action = 'update'),
                  (object.formState = 'enable'),
                this.router.navigate(['/dashboard/asociacion/detalle', object]).then((value:any)=>{
                  if (value) {
                    this.onAsociacionDetalles();
                  }
                  this.loading1 = false;
                })
              });
          }
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
                      this.location.back();
                      this.loading1 = false;
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

  fileChange(event: any) {
    this.file = event.target.files[0];
  }

  fileRutChange(event: any) {
    this.fileRut = event.target.files[0];
  }
  loadTiposAsociaciones() {
    this.asociacionesService.tiposAsociacion().subscribe(
      (response) => {
        this.tiposAsociaciones = response.data;
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
    this.asociacionesService.showAscociacionMiembrosModal(
      this.datosAsociacion,
      'Miembros'
    );
  }
  agregarMiembro() {
    this.asociacionesService.showSolicitudesModal(
      this.datosAsociacion,
      'Agregar miembro'
    );
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  prepareForm(action: string, asociacion?: any) {
    this.modalMode = action;
    this.form.reset();
    if (action == 'update') {
      this.idDpto?.setValue(asociacion.id_departamento);
      this.idMunic?.setValue(asociacion.id_municipio);
      this.nit?.setValue(asociacion.nit);
      this.direccion?.setValue(asociacion.direccion);
      this.infoAdicionalDir?.setValue(
        asociacion.informacion_adicional_direccion
      );
      this.nombre?.setValue(asociacion.nombre);
      this.isLegalConstituida?.setValue(asociacion.legalconstituida);
      this.telefono?.setValue(asociacion.telefono);
      let fechaRenv: string = '';
      if (asociacion?.fecha_renovacion_camarac) {
        fechaRenv = asociacion?.fecha_renovacion_camarac as string;
        fechaRenv = fechaRenv.split('T')[0];
      }
      this.fechRenvCamc?.setValue(formatDate(fechaRenv, 'yyyy-MM-dd', 'es'));
      //this.fotoCamc?.setValue(asociacion.foto_camarac);
      this.idTipoAsoc?.setValue(asociacion.id_tipo_asociacion_fk);
      this.corregVereda?.setValue(asociacion.corregimiento_vereda);
      this.direccion?.setValue(asociacion.direccion);
      this.nit?.disable();
      if (this.formState == 'disable') {
        this.form.disable();
      }
    }
  }
  goBack() {
    this.location.back();
  }
  onChangeLegalConst() {
    if (this.isLegalConstituida?.value == '1') {
      this.fotoCamc?.enable();
    } else {
      this.fotoCamc?.disable();
    }
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

  get isLegalConstituida() {
    return this.form.get('legalconstituida');
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
