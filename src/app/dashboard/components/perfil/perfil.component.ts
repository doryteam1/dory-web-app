
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasExperticiaService } from 'src/app/services/areas-experticia.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { ComunicacionEntreComponentesService } from 'src/app/shared/services/comunicacion-entre-componentes.service';
import { Subscription } from 'rxjs';
import { limiteMapa } from 'src/models/limiteMapaGoogle.model';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  usuario: any;
  @ViewChild('fileInput') inputFileDialog!: ElementRef;
  inputOn: boolean = true;
  fueraDirecion: boolean = false;
  loading: boolean = false;
  loadingPhoto: boolean = false;
  loadingseart: boolean = false;
  noexistendatos: boolean = false;
  areas: Array<any> = [];
  departamentos: Array<any> = [];
  municipios: Array<any> = [];
  corregimientos: Array<any> = [];
  veredas: Array<any> = [];
  tempDir: string = '';
  tempMunicId: number = -1;
  isOpenMap: boolean = false;
  mylatitudidmunicipio!: number;
  mylongitudidmunicipio!: number;
  faltadireccion: boolean = false;
  escogerdireccion: boolean = false;
  readonly:boolean=true
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    cedula: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    celular: new FormControl(''),
    direccion: new FormControl(''),
    informacion_adicional_direccion: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    id_tipo_usuario: new FormControl(''),
    id_area_experticia: new FormControl(0),
    nombre_negocio: new FormControl(''),
    foto: new FormControl(''),
    fecha_registro: new FormControl(''),
    fecha_nacimiento: new FormControl(''),
    nombre_vereda: new FormControl(''),
    id_departamento: new FormControl(0),
    id_municipio: new FormControl(0),
    id_corregimiento: new FormControl(0),
    id_vereda: new FormControl(''),
    latitud: new FormControl(''),
    longitud: new FormControl(''),
    nombre_corregimiento: new FormControl(''),
    otra_area_experticia: new FormControl(''),
    otra_area_experticia_descripcion: new FormControl(''),
    sobre_mi: new FormControl(''),
    id_sexo: new FormControl(null),
    id_etnia: new FormControl(null),
  });

  campos: any = {
    proveedor: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'coordenadas',
      'sexo',
      'etnia',
    ],
    investigadorexperto: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'area_experticia',
      'otra_area_experticia',
      'otra_area_experticia_descripcion',
      'sobre_mi',
      'email',
      'sexo',
      'etnia',
    ],
    transportador: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'coordenadas',
      'sexo',
      'etnia',
    ],
    piscicultor: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'coordenadas',
      'sexo',
      'etnia',
    ],
    administrador: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'coordenadas',
      'sexo',
      'etnia',
    ],
    consumidor: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'email',
      'sexo',
      'etnia',
    ],
    comerciante: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'direccion',
      'nombre_negocio',
      'email',
      'coordenadas',
      'sexo',
      'etnia',
    ],
    asociacion: [],
    pescador: [
      'cedula',
      'nombres',
      'apellidos',
      'celular',
      'departamento',
      'municipio',
      'corregimiento',
      'vereda',
      'direccion',
      'coordenadas',
      'email',
      'sexo',
      'etnia',
    ],
  };
  percentUploaded: number | undefined = 0;
  percentUploaded2: number | undefined = 0;
  municipiocambiado: boolean = false;
  editarperfil: boolean = false;
  mensajedirecion!: string;
  EditedInputValue: boolean = false;
  canceladoedir: boolean = false;
  photoDelate: boolean = false;
  photoUpdate: boolean = false;
  sexos: any[] = [];
  etnias: any[] = [];
  updatingDocument: string = '';
  photoUpdate2: boolean = false;
  photoDelete2: boolean = false;
  public modaGoogleMapa!: Subscription;
  constructor(
    private us: UsuarioService,
    private aes: AreasExperticiaService,
    private places: PlacesService,
    private storageService: StorageService,
    private storage: FirebaseStorageService,
    private appModalService: AppModalService,
    private compressImageSizeService: CompressImageSizeService,
    public platformLocation: PlatformLocation,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService
  ) {}
  ngOnDestroy(): void {
    this.modaGoogleMapa?.unsubscribe();
  }
  ngOnInit(): void {
    this.modaGoogleMapa =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (array) => {
          this.latitud?.setValue(array[0].latitud);
          this.longitud?.setValue(array[0].longitud);
          this.direccion?.setValue(array[0].direccion);
          this.idMunic?.setValue(array[0].id_municipio);
          this.closeMap();
        }
      );
   this.myNgOnInit();
  }

  myNgOnInit() {
 this.nombres?.disable();
 this.cedula?.disable();
 this.apellidos?.disable();
 this.celular?.disable();
 this.informacion_adicional_direccion?.disable();
 this.nombre_corregimiento?.disable();
 this.idMunic?.disable();
 this.idAreaExpert?.disable();
 this.sobre_mi?.disable();
 this.otraAreaExp?.disable();
 this.otraAreaExpDesc?.disable();
 this.latitud?.disable();
 this.longitud?.disable();
 this.email?.disable();
 this.sexo?.disable();
 this.etnia?.disable();
 this.idDpto?.disable();
 registerLocaleData(es);
 let email: string | null = localStorage.getItem('email');
 this.us.getUsuarioByEmail(email).subscribe(
   (response) => {
     this.usuario = response.data[0];
     console.log(this.usuario);
     this.form.get('id')?.setValue(this.usuario.id);
     this.form.get('cedula')?.setValue(this.usuario.cedula);
     this.form.get('nombres')?.setValue(this.usuario.nombres);
     this.form.get('apellidos')?.setValue(this.usuario.apellidos);
     this.form.get('celular')?.setValue(this.usuario.celular);
     this.form.get('direccion')?.setValue(this.usuario.direccion);
     this.form
       .get('informacion_adicional_direccion')
       ?.setValue(this.usuario.informacion_adicional_direccion);
     this.form.get('id_tipo_usuario')?.setValue(this.usuario.id_tipo_usuario);
     this.form.get('email')?.setValue(this.usuario.email);
     this.form
       .get('id_area_experticia')
       ?.setValue(this.usuario.id_area_experticia);
     this.form.get('sobre_mi')?.setValue(this.usuario.sobre_mi);
     this.form.get('nombre_negocio')?.setValue(this.usuario.nombre_negocio);
     this.form.get('foto')?.setValue(this.usuario.foto);
     this.form
       .get('fecha_registro')
       ?.setValue(Utilities.dateToISOString(this.usuario.fecha_registro));
     this.form
       .get('fecha_nacimiento')
       ?.setValue(Utilities.dateToISOString(this.usuario.fecha_nacimiento));
     this.form.get('nombre_vereda')?.setValue(this.usuario.nombre_vereda);

     this.form.get('id_corregimiento')?.setValue(this.usuario.id_corregimiento);
     this.form.get('id_vereda')?.setValue(this.usuario.id_vereda);
     this.form.get('latitud')?.setValue(this.usuario.latitud);
     this.form.get('longitud')?.setValue(this.usuario.longitud);
     this.form
       .get('nombre_corregimiento')
       ?.setValue(this.usuario.nombre_corregimiento);
     this.otraAreaExp?.setValue(this.usuario.otra_area_experticia);
     this.otraAreaExpDesc?.setValue(
       this.usuario.otra_area_experticia_descripcion
     );

     this.sexo?.setValue(this.usuario?.id_sexo);
     this.etnia?.setValue(this.usuario?.id_etnia);
     if (
       this.usuario.id_departamento == 0 ||
       this.usuario.id_departamento == null
     ) {
       this.form.get('id_departamento')?.setValue(70);
     } else {
       this.form.get('id_departamento')?.setValue(this.usuario.id_departamento);
     }
     this.form.get('id_municipio')?.setValue(this.usuario.id_municipio);
     this.loadAreasExp();
     this.loadDptos();
     this.loadMunic();
     this.loadCorregVeredas();
     this.nomCorregVeredasubs();
     this.loadSexos();
     this.loadEtnias();
     this.storageService.add('photoUser', this.usuario.foto);
     this.storageService.add('tipoUser', this.usuario.tipo_usuario);
     this.storageService.add(
       'nomApell',
       this.getNomApell(this.usuario.nombres, this.usuario.apellidos)
     );
     this.us.setAuthUserPhoto(this.usuario.foto);
     this.tempDir = this.form.get('direccion')?.value;
     this.tempMunicId = this.form.get('id_municipio')?.value;
   },
   (err) => {
     console.log(err);
   }
 );
  }
  openAddFileDialog(document: string) {
    this.updatingDocument = document;
    const element: HTMLElement = this.inputFileDialog.nativeElement;
    element.click();
  }

  uploadToServer(file: any) {
    let fileName = '/perfil/user_' + this.id?.value;
    this.storage
      .cloudStorageTask(fileName, file)
      .percentageChanges()
      .subscribe((response) => {
        console.log(response);
        this.percentUploaded = response;
        if (this.percentUploaded == 100) {
          this.storage
            .cloudStorageRef(fileName)
            .getDownloadURL()
            .subscribe(
              (downloadUrl) => {
                console.log(downloadUrl);
                this.us
                  .actualizarUsuario(this.id?.value, { foto: downloadUrl })
                  .subscribe(
                    (response) => {
                      this.usuario.foto = downloadUrl;
                      this.us.setAuthUserPhoto(this.usuario.foto);
                      this.loadingPhoto = false;
                      this.photoUpdate = true;
                      setTimeout(() => {
                        this.photoUpdate = false;
                      }, 3000);
                    },
                    (err) => {
                      this.loadingPhoto = false;
                      this.photoUpdate = false;
                      console.log(err);
                    }
                  );
              },
              (err) => {
                this.loadingPhoto = false;
                this.photoUpdate = false;
                console.log(err);
              }
            );
        }
      });
  }

  async uploadDocumentToServer(file: any, document: string) {
    let ext = file.name.split('.')[1];
    let fileName = '';
    let urlDeleteDocument = '';
    if (document == 'cedula') {
      fileName = '/usuarios/cedulas/' + 'cedula-' + this.id?.value + '.' + ext;
      urlDeleteDocument = this.usuario.url_imagen_cedula;
    } else if (document == 'sisben') {
      fileName = '/usuarios/sisben/' + 'sisben-' + this.id?.value + '.' + ext;
      urlDeleteDocument = this.usuario.url_sisben;
    }

    try {
      await this.storage.deleteByUrl(urlDeleteDocument).toPromise();
    } catch (err) {
      try {
        await this.storage.deleteByUrl(urlDeleteDocument).toPromise();
      } catch (err) {}
    }
    this.storage
      .cloudStorageTask(fileName, file)
      .percentageChanges()
      .subscribe((response) => {
        console.log(response);
        this.percentUploaded2 = response;
        if (this.percentUploaded2 == 100) {
          this.storage
            .cloudStorageRef(fileName)
            .getDownloadURL()
            .subscribe(
              (downloadUrl) => {
                let body: any;
                if (document == 'cedula') {
                  body = {
                    url_imagen_cedula: downloadUrl,
                  };
                } else if (document == 'sisben') {
                  body = {
                    url_sisben: downloadUrl,
                  };
                }
                this.us.actualizarUsuario(this.id?.value, body).subscribe(
                  async (response) => {
                    if (document == 'cedula') {
                      this.usuario.url_imagen_cedula = downloadUrl;
                    } else if (document == 'sisben') {
                      this.usuario.url_sisben = downloadUrl;
                    }

                    this.photoUpdate2 = true;
                    setTimeout(() => {
                      this.photoUpdate2 = false;
                    }, 3000);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              },
              (err) => {
                console.log(err);
              }
            );
        }
      });
  }

  async fileChange(event: any) {
    if (this.updatingDocument == 'foto') {
      this.loadingPhoto = true;
    }
    const imageFile = event.target.files[0];
    event.srcElement.value = '';
    try {
      const compressedFile =
        await this.compressImageSizeService.handleImageUpload(imageFile);
      if (this.updatingDocument == 'foto') {
        await this.uploadToServer(compressedFile);
      } else {
        if (imageFile.name.split('.')[1] == 'pdf') {
          await this.uploadDocumentToServer(imageFile, this.updatingDocument);
        } else {
          await this.uploadDocumentToServer(
            compressedFile,
            this.updatingDocument
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  deletePhotoPerfil() {
    let fotoUrle=this.usuario.foto
    this.us.actualizarUsuario(this.id?.value, { foto: '' }).subscribe(
      (response) => {
        this.usuario.foto = '';
        this.us.setAuthUserPhoto(this.usuario.foto);
        this.storageService.add('photoUser', '');
        this.photoDelate = true;
         this.storage.deleteByUrl(fotoUrle);
        setTimeout(() => {
          this.photoDelate = false;
          /*  window.location.reload(); */
        }, 3000);
      },
      (err) => {
        this.photoDelate = false;
        console.log(err);
      }
    );
  }

  deleteDocument(keyName: string) {
    let body: any = {};
    body[keyName] = null;
    let urlDeleteDocument = this.usuario[keyName];
    this.us.actualizarUsuario(this.id?.value, body).subscribe(
      async (response) => {
        try {
          await this.storage.deleteByUrl(urlDeleteDocument).toPromise();
          this.usuario[keyName] = '';
        } catch (err) {
          try {
            await this.storage.deleteByUrl(urlDeleteDocument).toPromise();
            this.usuario[keyName] = '';
          } catch (err) {
            this.usuario[keyName] = '';
          }
        }

        this.photoDelete2 = true;
        this.usuario;
        setTimeout(() => {
          this.photoDelete2 = false;
          /*  window.location.reload(); */
        }, 3000);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  nomCorregVeredasubs() {
    this.nomCorreg?.valueChanges.subscribe((response) => {
      this.idCorreg?.patchValue(0, { emitEvent: false });
      this.idCorreg?.updateValueAndValidity();
    });

    this.nomVereda?.valueChanges.subscribe((response) => {
      this.idVereda?.patchValue(0, { emitEvent: false });
      this.idVereda?.updateValueAndValidity();
    });
  }

  getNomApell(nombres: string, apellidos: string) {
    let nomComp: string = '';
    if (nombres) {
      nomComp = nombres.split(' ')[0];
    }
    if (apellidos) {
      nomComp = nomComp + ' ' + apellidos.split(' ')[0];
    }
    return nomComp;
  }

  loadAreasExp() {
    this.aes.getAreasDeExperticia().subscribe(
      (response) => {
        this.areas = response.data;
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
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadMunic() {
    this.places
      .getMunicipiosDepartamentos(this.form.get('id_departamento')?.value)
      .subscribe(
        (response) => {
          this.municipios = response.data;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  loadSexos() {
    this.us.getSexos().subscribe(
      (response) => {
        this.sexos = response.data;
      },
      (err) => {}
    );
  }

  loadEtnias() {
    this.us.getEtnias().subscribe(
      (response) => {
        this.etnias = response.data;
      },
      (err) => {}
    );
  }

  changeDpto() {
    this.form.get('id_municipio')?.setValue(0);
    this.places
      .getMunicipiosDepartamentos(this.form.get('id_departamento')?.value)
      .subscribe(
        (response) => {
          this.municipios = response.data;
        },
        (err) => {
          console.log(err);
        }
      );
  }
  invalid(datos: any) {
    if (!this.form.get('direccion')?.value) {
      console.log(this.usuario.direccion);
      console.log(datos);
      this.faltadireccion = true;
    } else {
      console.log(this.usuario.direccion);
      console.log(datos);
      this.faltadireccion = false;
    }
  }
  changeMunic() {
    this.municipiocambiado = true;
    this.idCorreg?.setValue(0);
    this.idVereda?.setValue(0);
    this.places.getCorregimientosMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.corregimientos = response.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this.places.getVeredasMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.veredas = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
    if (this.usuario?.tipo_usuario !== 'Proveedor') {
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              this.mylatitudidmunicipio = Number(response.data[0].latitud);
              this.mylongitudidmunicipio = Number(response.data[0].longitud);
              if (this.idMunic?.value == this.tempMunicId) {
                this.direccion?.setValue(this.tempDir);
              } else if (!this.isOpenMap) {
                this.verMap();
                if (!this.canceladoedir) {
                  this.direccion?.setValue('');
                }
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  loadCorregVeredas() {
    this.places.getCorregimientosMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.corregimientos = response.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this.places.getVeredasMunicipio(this.idMunic?.value).subscribe(
      (response) => {
        this.veredas = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onSubmit() {
    this.latitud?.enable();
    this.longitud?.enable();
    this.loading = true;
    this.editarperfil = false;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }
    this.us
      .actualizarUsuario(this.form.get('id')?.value, this.form.getRawValue())
      .subscribe(
        (response) => {
          this.loading = false;
          this.latitud?.disable();
          this.longitud?.disable();
          this.nombres?.disable();
          this.cedula?.disable();
          this.apellidos?.disable();
          this.celular?.disable();
          this.informacion_adicional_direccion?.disable();
          this.nombre_corregimiento?.disable();
          this.idMunic?.disable();
          this.idAreaExpert?.disable();
          this.sobre_mi?.disable();
          this.otraAreaExp?.disable();
          this.otraAreaExpDesc?.disable();
          this.sexo?.disable();
          this.etnia?.disable();
          this.mensajedirecion = '';
          this.EditedInputValue = false;
          this.storageService.add(
            'nomApell',
            this.getNomApell(this.nombres?.value, this.apellidos?.value)
          );
          this.appModalService
            .modalAlertActualizadoComponent('Perfil actualizado correctamente')
            .then((result) => {
              window.location.reload();
            })
            .catch((result) => {});
        },
        (err) => {
          this.loading = false;
          console.log(err);
          this.latitud?.disable();
          this.longitud?.disable();
          this.nombres?.disable();
          this.cedula?.disable();
          this.apellidos?.disable();
          this.celular?.disable();
          this.informacion_adicional_direccion?.disable();
          this.nombre_corregimiento?.disable();
          this.idMunic?.disable();
          this.idAreaExpert?.disable();
          this.sobre_mi?.disable();
          this.otraAreaExp?.disable();
          this.otraAreaExpDesc?.disable();
          this.sexo?.disable();
          this.etnia?.disable();
          this.mensajedirecion = '';
          this.EditedInputValue = false;
          this.appModalService
            .modalAlertActualizadoComponent(
              'Parece que hubo un error al actualizar el perfil, por favor inténtalo de nuevo'
            )
            .then((result) => {})
            .catch((result) => {});
        }
      );
  }

  corregSelected() {
    this.nomCorreg?.setValue('');
  }

  veredaSelected() {
    this.nomVereda?.setValue('');
  }
  closeMap() {
    this.appModalService.CloseGoogleMapGeneralModal();
  }
  verMap() {
    if (this.editarperfil && this.usuario?.tipo_usuario !== 'Proveedor') {
      let limiteMapa: limiteMapa = {
        limite: 'Sucre',
        nivDivAdm: 'Departamento',
        id_departamento: 70,
      };
      let atributos: any;
      let modalheadergooglemap = false;
      let mapaSeach = true;
      this.isOpenMap = true;
      if (this.municipiocambiado) {
        atributos = {
          longAndLat: {
            lat: this.mylatitudidmunicipio,
            lng: this.mylongitudidmunicipio,
          },
        };
      } else {
        atributos = {
          longAndLat: {
            lat: parseFloat(this.latitud?.value),
            lng: parseFloat(this.longitud?.value),
          },
        };
      }
      this.platformLocation.onPopState(() => {
        this.appModalService.CloseGoogleMapGeneralModal();
      });
      this.appModalService
        .GoogleMapModalGeneral(
          atributos,
          modalheadergooglemap,
          '',
          mapaSeach,
          limiteMapa
        )
        .then((result) => {
          this.isOpenMap = false;
          this.municipiocambiado = false;
          if (!this.form.get('direccion')?.value && this.usuario.direccion) {
            this.form.get('direccion')?.setValue(this.tempDir);
            this.form.get('id_municipio')?.setValue(this.tempMunicId);
            this.form.get('latitud')?.setValue(this.latitud?.value);
            this.form.get('longitud')?.setValue(this.longitud?.value);
            return;
          }
          if (
            this.form.getRawValue().direccion == '' ||
            this.form.getRawValue().direccion == null
          ) {
            this.latitud?.setValue(this.usuario.latitud);
            this.longitud?.setValue(this.usuario.longitud);
            this.idMunic?.setValue(this.usuario.id_municipio);
            return;
          }
        })
        .catch((err) => {
          this.isOpenMap = false;
          this.municipiocambiado = false;
          if (!this.form.get('direccion')?.value && this.usuario.direccion) {
            this.form.get('direccion')?.setValue(this.tempDir);
            this.form.get('id_municipio')?.setValue(this.tempMunicId);
            this.form.get('latitud')?.setValue(this.latitud?.value);
            this.form.get('longitud')?.setValue(this.longitud?.value);
            return;
          }
          if (
            this.form.getRawValue().direccion == '' ||
            this.form.getRawValue().direccion == null
          ) {
            this.latitud?.setValue(this.usuario.latitud);
            this.longitud?.setValue(this.usuario.longitud);
            this.idMunic?.setValue(this.usuario.id_municipio);
            return;
          }
          console.log(err);
        });
    }
  }

  inputEnable() {
    this.inputOn = false;
  }
  mostrarPorTipo(campo: string) {
    let index = -1;
    let tipoUsuario = this.usuario?.tipo_usuario;
    if (tipoUsuario == 'Investigador Experto') {
      tipoUsuario = 'investigadorexperto';
    }
    index = this.campos[tipoUsuario?.toLowerCase()]?.indexOf(campo);
    return index > -1;
  }
  onKeyInput(nombreinput?: any) {
    /*  if (this.form.getRawValue()[nombreinput] == this.usuario[nombreinput]) {
      this.validateInputFormObject.forEach((o) => (o[nombreinput] = false));
      let objeto = Object.values(this.validateInputFormObject[0]);
      if (objeto.includes(true)) {
        this.EditedInputValue = true;
      } else {
        this.EditedInputValue = false;
      }
      return;
    }
    if (
      this.form.getRawValue()[nombreinput] == '' ||
      (null && this.usuario[nombreinput] == null) ||
      ''
    ) {
      this.validateInputFormObject.forEach((o) => (o[nombreinput] = false));
      let objeto = Object.values(this.validateInputFormObject[0]);
      if (objeto.includes(true)) {
        this.EditedInputValue = true;
      } else {
        this.EditedInputValue = false;
      }
      return;
    }
    if (this.form.getRawValue()[nombreinput] !== this.usuario[nombreinput]) {
      this.validateInputFormObject.forEach((o) => (o[nombreinput] = true));
      let objeto = Object.values(this.validateInputFormObject[0]);
      if (objeto.includes(true)) {
        this.EditedInputValue = true;
      } else {
        this.EditedInputValue = false;
      }
      return;
    } */
  }
  editarPerfi() {
    this.editarperfil = true;
    if (this.usuario?.tipo_usuario == 'Proveedor') {
      this.mensajedirecion = 'Escriba aquí su direción';
      this.readonly=false
      this.idDpto?.enable();
    } else if (this.usuario?.tipo_usuario !== 'Proveedor') {
      this.idDpto?.disable();
      this.readonly = true;
      this.mensajedirecion = 'Escoja aquí su direción';
    }
    this.nombres?.enable();
    this.cedula?.enable();
    this.apellidos?.enable();
    this.celular?.enable();
    this.informacion_adicional_direccion?.enable();
    this.nombre_corregimiento?.enable();
    this.idMunic?.enable();
    this.idAreaExpert?.enable();
    this.sobre_mi?.enable();
    this.otraAreaExp?.enable();
    this.otraAreaExpDesc?.enable();
    this.sexo?.enable();
    this.etnia?.enable();
  }
  cancelProfileEditing() {
    this.readonly = true;
    this.editarperfil = false;
    this.myNgOnInit();
  }
  get id() {
    return this.form.get('id');
  }

  get cedula() {
    return this.form.get('cedula');
  }

  get nombres() {
    return this.form.get('nombres');
  }

  get apellidos() {
    return this.form.get('apellidos');
  }

  get celular() {
    return this.form.get('celular');
  }

  get direccion() {
    return this.form.get('direccion');
  }
  get informacion_adicional_direccion() {
    return this.form.get('informacion_adicional_direccion');
  }

  get idTipoUsuario() {
    return this.form.get('id_tipo_usuario');
  }

  get email() {
    return this.form.get('email');
  }

  get idAreaExpert() {
    return this.form.get('id_area_experticia');
  }

  get nombreNegocio() {
    return this.form.get('nombre_negocio');
  }

  get foto() {
    return this.form.get('foto');
  }

  get fechaRegistro() {
    return this.form.get('fecha_registro');
  }

  get fechaNac() {
    return this.form.get('fecha_nacimiento');
  }

  get nomVereda() {
    return this.form.get('nombre_vereda');
  }

  get idDpto() {
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get idCorreg() {
    return this.form.get('id_corregimiento');
  }
  get nombre_corregimiento() {
    return this.form.get('nombre_corregimiento');
  }

  get idVereda() {
    return this.form.get('id_vereda');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get nomCorreg() {
    return this.form.get('nombre_corregimiento');
  }

  get otraAreaExp() {
    return this.form.get('otra_area_experticia');
  }
  get sobre_mi() {
    return this.form.get('sobre_mi');
  }

  get otraAreaExpDesc() {
    return this.form.get('otra_area_experticia_descripcion');
  }

  get sexo() {
    return this.form.get('id_sexo');
  }

  get etnia() {
    return this.form.get('id_etnia');
  }
}
