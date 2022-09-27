
import { Component, OnInit,
  HostListener,
  OnDestroy} from '@angular/core';
  import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import {  Subscription } from 'rxjs';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { SafeUrl } from '@angular/platform-browser';
import { ComunicacionEntreComponentesService } from '../../../shared/services/comunicacion-entre-componentes.service';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { limiteMapa } from '../../../../models/limiteMapaGoogle.model';

const _ = require('lodash');
@Component({
  selector: 'app-granja-detalle-form',
  templateUrl: './granja-detalle-form.component.html',
  styleUrls: ['./granja-detalle-form.component.scss'],
})
export class GranjaDetalleFormComponent implements OnInit, OnDestroy {
  formState = 'enable';
  modalMode: string = 'update';
  granja: any;
  file: any = null;
  inputOn: boolean = true;
  /* error: string = ''; */
  action!: string;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  photosGranjaArray: Array<string | SafeUrl> = [];
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  filesfinalCreate: any[] = [];
  loading1: boolean = false;
  loadingphoto: boolean = false;
  cargandodata: boolean = false;
  authUserId: number = -1;
  id_granjanew: any;
  /* Mapa variables */
  noexistendatos: boolean = false;
  faltanargumentos: boolean = false;
  faltadireccion: boolean = false;
  /* form declaraciones*/
  form: FormGroup = new FormGroup({
    nombre_granja: new FormControl('', [Validators.required]),
    area: new FormControl(0, [Validators.required]),
    numero_trabajadores: new FormControl(0, [Validators.required]),
    produccion_estimada_mes: new FormControl(0, [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    informacion_adicional_direccion: new FormControl('', [Validators.required]),
    latitud: new FormControl(0, [Validators.required]),
    longitud: new FormControl(0, [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl(0, [Validators.required]),
    id_vereda: new FormControl(0),
    id_corregimiento: new FormControl(0),
    corregimiento_vereda: new FormControl(''),
    arrayTiposInfraestructuras: new FormArray([]),
    arrayEspecies: new FormArray([]),
  });
  onMapa: boolean=false;
  constructor(
    private granjaService: GranjasService,
    private places: PlacesService,
    private ar: ActivatedRoute,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService,
    private compressImageSizeService: CompressImageSizeService,
    private storage: FirebaseStorageService
  ) {

  }
  /* agregar esto para camcelar el subscribe de  comunicacionEntreComponentesService*/
  public changeArray!: Subscription;
  public ArrayDelate!: Subscription;

  ngOnInit(): void {
    registerLocaleData(es);
    this.granja = this.ar.snapshot.params;
    /*  console.log(this.granja); */
    let action = this.ar.snapshot.paramMap.get('action');
    this.formState = this.ar.snapshot.paramMap.get('formState')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    this.prepareForm(action!, this.granja);
    this.loadDptos();
    this.granjaService.getInfraestructuras().subscribe(
      (response) => {
        this.infraestructurasData = response.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this.granjaService.getEspecies().subscribe(
      (response) => {
        this.especiesData = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
    /* escucha el componente que carga los files desde la modal */
    this.changeArray =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (array) => {
          if (!this.onMapa) {
            if (array.length > 0) {
              if (action == 'create') {
                if (array[0].length > 0) {
                  for (let index = 0; index < array[0].length; index++) {
                    const element = array[0][index];
                    this.photosGranjaArray = array[0];
                    console.log(this.photosGranjaArray);
                  }
                } else {
                  this.photosGranjaArray = [];
                }
                for (let index = 0; index < array[1].length; index++) {
                  const element = array[1][index];
                  this.filesfinalCreate.push(element);
                }
                for (let index = 0; index < array[2].length; index++) {
                  const element = array[2][index];
                  this.filesfinalCreate.splice(element, 1);
                }
                console.log(this.photosGranjaArray);
                console.log(this.filesfinalCreate);
              } else if (action == 'update') {
                this.loadPhotos(array);
              }
            }
          }else{
            console.log(array);
            this.latitud?.setValue(array[0].latitud);
            this.longitud?.setValue(array[0].longitud);
            this.direccion?.setValue(array[0].direccion);
            this.idMunic?.setValue(array[0].id_municipio);
            this.closeMap();
          }
        }
      );
    this.ArrayDelate =
      this.comunicacionEntreComponentesService.ArrayDelate.subscribe(
        (arrayFotoDelate) => {
          this.photosDelete(arrayFotoDelate);
        }
      );
  }

  ngOnDestroy(): void {
    /* cancelamos las subcripciones del servicio */
    this.changeArray?.unsubscribe();
    this.ArrayDelate?.unsubscribe();
  }
  addGranja() {
    this.loading1 = true;
    if (!this.form.valid) {
      if (this.form.getRawValue().direccion == '') {
        this.faltadireccion = true;
      } else {
        this.faltadireccion = false;
      }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    if (this.form.getRawValue().direccion !== '') {
      this.form.disable();
      this.cargandodata = true;
      this.faltadireccion = false;
      this.granjaService.addGranja(this.form.getRawValue()).subscribe(
        (response) => {
          this.id_granjanew = response.body.insertId;
          if (this.filesfinalCreate.length !== 0) {
            this.loadPhotos(this.filesfinalCreate);
            this.loadingphoto = true;
          } else {
            this.loading1 = false;
            this.goBack();
          }
        },
        (err) => {
          this.form.enable();
          this.cargandodata = false;
          this.loading1 = false;
          console.log(err);
        }
      );
    } else {
      this.loading1 = false;
      this.faltadireccion = true;
    }
  }

  updateGranja() {
    this.loading1 = true;
    if (!this.form.valid) {
      if (this.form.getRawValue().direccion == '') {
        this.faltadireccion = true;
      } else {
        this.faltadireccion = false;
      }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    if (this.form.getRawValue().direccion !== '') {
      this.form.disable();
      this.cargandodata = true;
      this.faltadireccion = false;
      this.granjaService
        .updateGranja(this.granja.id_granja, this.form.getRawValue())
        .subscribe(
          (response) => {
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            this.form.enable();
            this.cargandodata = false;
            console.log(err);
            this.loading1 = false;
          }
        );
    } else {
      this.loading1 = false;
      this.faltadireccion = true;
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

  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }

  onCheckboxChange(e: any, controlName: string) {
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach(
        (
          item: AbstractControl,
          i: number,
          controls: Array<AbstractControl>
        ) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            return;
          }
          i++;
        }
      );
    }
  }

  isChecked(controlName: string, value: number) {
    let checked: boolean = false;
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    checkArray.controls.forEach(
      (item: AbstractControl, i: number, controls: Array<AbstractControl>) => {
        if (item.value == value) {
          checked = true;
        }
      }
    );
    return checked;
  }

  initForm() {
    this.idmunicipioselec();
    this.nombreGranja?.setValue('');
    this.area?.setValue(null);
    this.numeroTrabajadores?.setValue(null);
    this.prodEstimadaMes?.setValue(null);
    this.direccion?.setValue('');
    this.informacionAdicionalDireccion?.setValue('');
    this.latitud?.setValue(0);
    this.longitud?.setValue(0);
    this.descripcion?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
    this.idVereda?.setValue(0);
    this.idCorregimiento?.setValue(0);
    this.corregimiento_vereda?.setValue('');
    this.infraestructuras.clear();
    this.especies.clear();
  }

  prepareForm(action: string, granja?: any) {
    this.faltanargumentos = false;
    this.faltadireccion = false;
    this.modalMode = action;
    this.form.reset();
    this.initForm();
    this.idDpto?.setValue(70);
    if (action == 'update') {
      this.granjaService
        .getGranjaDetalle(this.granja.id_granja)
        .subscribe((granja) => {
          let granjaDetalle = granja.data[0];
          this.photosGranjaArray = granjaDetalle.fotos;
          this.nombreGranja?.setValue(granjaDetalle.nombre);
          this.area?.setValue(granjaDetalle.area);
          this.numeroTrabajadores?.setValue(granjaDetalle.numero_trabajadores);
          this.prodEstimadaMes?.setValue(granjaDetalle.produccion_estimada_mes);
          this.direccion?.setValue(granjaDetalle.direccion);
          this.informacionAdicionalDireccion?.setValue(
            granjaDetalle.informacion_adicional_direccion
          );
          this.latitud?.setValue(granjaDetalle.latitud);
          this.longitud?.setValue(granjaDetalle.longitud);
          this.descripcion?.setValue(granjaDetalle.descripcion);
          this.idDpto?.setValue(granjaDetalle.id_departamento);
          this.idMunic?.setValue(granjaDetalle.id_municipio);
          this.idVereda?.setValue(granjaDetalle.id_vereda);
          this.idCorregimiento?.setValue(granjaDetalle.id_corregimiento);
          this.corregimiento_vereda?.setValue(
            granjaDetalle.corregimiento_vereda
          );
          if (
            granjaDetalle.infraestructuras &&
            granjaDetalle.infraestructuras.length > 0
          ) {
            granjaDetalle.infraestructuras.forEach((element: any) => {
              this.infraestructuras?.push(
                new FormControl(element.id_infraestructura)
              );
            });
          }

          if (granjaDetalle.especies && granjaDetalle.especies.length > 0) {
            granjaDetalle.especies.forEach((element: any) => {
              this.especies?.push(new FormControl(element.id_especie));
            });
          }
        });
      if (this.formState == 'disable') {
        this.form.disable();
      }
    }
    /*   console.log('granjas cargada en form ', this.form.getRawValue()); */
  }
  goBack() {
    this.platformLocation.back();
  }
  /* Funciones necesarias para el mapa y escoger direccion */
  idmunicipioselec() {
    if (this.modalMode == 'update') {
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              if (
                this.form.get('id_municipio')?.value !==
                this.granja.id_municipio
              ) {
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
                this.direccion?.setValue('');
                this.verMapaDireccion();
                this.faltadireccion = true;
              } else {
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
                this.direccion?.setValue('');
                this.verMapaDireccion();
                this.faltadireccion = true;
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (this.modalMode == 'create') {
      this.faltanargumentos = false;
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              this.latitud?.setValue(response.data[0].latitud);
              this.longitud?.setValue(response.data[0].longitud);
              this.direccion?.setValue('');
              this.verMapaDireccion();
              this.faltadireccion = true;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  closeMap(){
     this.appModalService.CloseGoogleMapGeneralModal();
  }
  verMapaDireccion() {
    this.onMapa=true
    this.faltadireccion = false;
    if (this.modalMode == 'update') {
        let modalheadergooglemap = false;
        let mapaSeach = true;
              let limiteMapa:limiteMapa = {
                limite: 'Sucre',
                nivDivAdm: 'Departamento',
                id_departamento: 70,
              };
        let atributos = {
          longAndLat: {
            lat: this.form.getRawValue().latitud,
            lng: this.form.getRawValue().longitud,
          },
        };
        this.platformLocation.onPopState(() => {
          this.appModalService.CloseGoogleMapGeneralModal();
        });
        this.appModalService
          .GoogleMapModalGeneral(atributos, modalheadergooglemap, '', mapaSeach,limiteMapa)
          .then((result) => {
            this.onMapa = false;
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          })
          .catch((result) => {
            this.onMapa = false;
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          });
    } else if (this.modalMode == 'create') {
      if (
        this.form.getRawValue().latitud !== 0 &&
        this.form.getRawValue().longitud !== 0
      ) {
        this.faltanargumentos = false;
          let modalheadergooglemap = false;
          let mapaSeach = true;
          let limiteMapa: limiteMapa = {
            limite: 'Sucre',
            nivDivAdm: 'Departamento',
            id_departamento: 70,
          };
          let atributos = {
            longAndLat: {
              lat: this.form.getRawValue().latitud,
              lng: this.form.getRawValue().longitud,
            },
          };
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
              this.onMapa = false;
              if (this.form.getRawValue().direccion == '') {
                this.faltadireccion = true;
                this.latitud?.setValue(0);
                this.longitud?.setValue(0);
                this.idMunic?.setValue(null);
              } else {
                this.faltadireccion = false;
              }
            })
            .catch((result) => {
              this.onMapa = false;
              if (this.form.getRawValue().direccion == '') {
                this.faltadireccion = true;
                this.latitud?.setValue(0);
                this.longitud?.setValue(0);
                this.idMunic?.setValue(null);
              } else {
                this.faltadireccion = false;
              }
            });
        }

    }
  }

  /* funciones necesarias para cargar y adicionar fotos */
  @HostListener('loadPhotos')
  async loadPhotos(event: any) {
    if (this.granja.action == 'create') {
      /* Se ejecuta cuando se esta creando una granja */
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase =
          '/granjas/User' +
          this.authUserId +
          '/granja' +
          this.id_granjanew +
          '/foto';
        let files: Array<any> = compressedFiles;
        let arrayFotos: Array<any> = [];
        for (let i = 0; i < files.length; i++) {
          let nowTimestamp = new Date().getTime().toString();
          await this.storage
            .cloudStorageTask(fileNameBase + nowTimestamp, files[i])
            .percentageChanges()
            .toPromise();
          let downloadUrl = await this.storage
            .cloudStorageRef(fileNameBase + nowTimestamp)
            .getDownloadURL()
            .toPromise();
          arrayFotos.push(downloadUrl);
          console.log('Fotos guardadas');
        }
        this.photosGranjaArray = [];
        this.photosGranjaArray = this.photosGranjaArray.concat(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    } else if (this.granja.action == 'update') {
      /* Se ejecuta cuando se esta editando una granja */
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase =
          '/granjas/User' +
          this.authUserId +
          '/granja' +
          this.granja.id_granja +
          '/foto';
        let files: Array<any> = compressedFiles;
        console.log(files);
        let arrayFotos: Array<any> = [];
        for (let i = 0; i < files.length; i++) {
          let nowTimestamp = new Date().getTime().toString();
          await this.storage
            .cloudStorageTask(fileNameBase + nowTimestamp, files[i])
            .percentageChanges()
            .toPromise();
          let downloadUrl = await this.storage
            .cloudStorageRef(fileNameBase + nowTimestamp)
            .getDownloadURL()
            .toPromise();
          arrayFotos.push(downloadUrl);
          console.log('Fotos guardadas');
        }
        this.photosGranjaArray = this.photosGranjaArray.concat(arrayFotos);
        /* entrega las ultimas fotos que se cargaron, las manda al componente
        que las necesite */
        this.comunicacionEntreComponentesService.changeMyArray2(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    }
  }

  photosUpdate() {
    if (this.granja.action == 'update') {
      this.granjaService
        .updatePhotos(this.granja.id_granja, {
          arrayFotos: this.photosGranjaArray,
        })
        .subscribe(
          (response) => {
            console.log('fotos guardadas: ');
            console.log(response);
            this.loading1 = false;
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (this.granja.action == 'create') {
      /* Sube las fotos a la BD */
      this.granjaService
        .updatePhotos(this.id_granjanew, {
          arrayFotos: this.photosGranjaArray,
        })
        .subscribe(
          (response) => {
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  photosDelete(arraydelate: any[]) {
    console.log('nuevas fotos a actualizar despues de un delate');
    this.granjaService
      .updatePhotos(this.granja.id_granja, {
        arrayFotos: arraydelate,
      })
      .subscribe(
        (response) => {
          this.photosGranjaArray = arraydelate;
          console.log(response);
          console.log(this.photosGranjaArray);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  openPhotosModal() {
    this.platformLocation.onPopState(() => {
      this.appModalService.CloseModalGalleryVerAdiconarEliminarFotos();
    });
    let showconteslaider = false;
    let veryadicionar = true;
    let arrayFotos = this.photosGranjaArray;
    let filesCreate: any;
    if (this.modalMode == 'create') {
      filesCreate = this.filesfinalCreate;
    } else if (this.modalMode == 'update') {
      filesCreate = -1;
    }
    console.log(filesCreate);
    this.appModalService
      .modalGalleryVerAdiconarEliminarFoto(
        -1,
        -1,
        -1,
        showconteslaider,
        veryadicionar,
        arrayFotos,
        filesCreate,
        this.modalMode
      )
      .then((result: any) => {})
      .catch((result) => {});
  }
  get idDpto() {
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get nombreGranja() {
    return this.form.get('nombre_granja');
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get area() {
    return this.form.get('area');
  }

  get numeroTrabajadores() {
    return this.form.get('numero_trabajadores');
  }

  get prodEstimadaMes() {
    return this.form.get('produccion_estimada_mes');
  }

  get direccion() {
    return this.form.get('direccion');
  }

  get corregimiento_vereda() {
    return this.form.get('corregimiento_vereda');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get idVereda() {
    return this.form.get('id_vereda');
  }

  get idCorregimiento() {
    return this.form.get('id_corregimiento');
  }

  get infraestructuras() {
    return this.form.get('arrayTiposInfraestructuras') as FormArray;
  }

  get especies() {
    return this.form.get('arrayEspecies') as FormArray;
  }
  get informacionAdicionalDireccion() {
    return this.form.get('informacion_adicional_direccion');
  }
}

