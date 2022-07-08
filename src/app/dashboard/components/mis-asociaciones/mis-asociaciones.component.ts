import { Component, OnInit ,  ElementRef,
  ViewChild, } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map,finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { formatDate } from '@angular/common' 
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
const _ = require('lodash');

@Component({
  selector: 'app-mis-asociaciones',
  templateUrl: './mis-asociaciones.component.html',
  styleUrls: ['./mis-asociaciones.component.scss']
})
export class MisAsociacionesComponent implements OnInit {
  @ViewChild('myselecmunicipio') myselecmunicipio!: ElementRef;
  @ViewChild('map') map: any;
  @ViewChild('fileInput') inputFileDialog!: ElementRef;
  asociaciones: Array<any> = [];
  showNotFound: boolean = false;
  indicenegocio!: number;
  guarlatlog: boolean = false;
  noexistendatos: boolean = false;
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  valorbuscarx: string = '';
  p!: number;
  tempDir:string = '';
  tempMunicId:number = -1;
  firstTimeOpenModal = true;
  form: FormGroup = new FormGroup({
    nit: new FormControl('',[Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    legalconstituida: new FormControl('', [Validators.required]),
    informacion_adicional_direccion:new FormControl('',),
    fecha_renovacion_camarac: new FormControl('',[Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
    foto_camarac: new FormControl('',[Validators.required]),
    id_tipo_asociacion_fk:new FormControl('',[Validators.required])
  });
  file: any = null;
  productImagePath: string = '';
  itemUpdateIndex: number = -1;
  modalMode: string = 'create';
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  apiLoaded: Observable<boolean>;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  authUserId: number = -1;
  vertices = vertices;
  options: google.maps.MapOptions = {
    scrollwheel: true,
    center: { lat: 0, lng: 0 },
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };
  photosNegocioArray: Array<string> = [];
  photosNegocioArrayCopy: Array<string> = [];
  photosNegocioUrlToDel: Array<string> = [];
  isPhotoSelectingToDel: boolean = false;
  indexSelectedToDel: Array<number> = [];
  showNotFoundPhotos: boolean = false;
  timeLapsed1: number = 0;
  tiposAsociaciones: Array<any> = [];
  error:string = '';
  showDetalleAsociacion:boolean = false;

  constructor(
    private asociacionesService: AsociacionesService,
    private modalService: NgbModal,
    private storage: FirebaseStorageService,
    private places: PlacesService,
    private appModalService: AppModalService,
    httpClient: HttpClient,
    private geocoder: MapGeocoder,
    private confirmModalMapService: ConfirmModalMapService
  ) {
    this.apiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=' + environment.doryApiKey,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    registerLocaleData( es );
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.asociacionesService.getAsociacionesUsuario(this.authUserId).subscribe(
      (respose) => {
        this.asociaciones = respose.data;
        if (this.asociaciones.length < 1) {
          this.showNotFound = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.loadDptos();
    this.loadAsociaciones();
  }

  initForm() {
    this.nombre?.setValue('');
    this.idTipoAsoc?.setValue(null);
    this.isLegalConstituida?.setValue(null);
    this.nit?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
    this.corregVereda?.setValue('');
    this.direccion?.setValue('');
    this.infoAdicionalDir?.setValue('');
    this.fechRenvCamc?.setValue('');
    this.fotoCamc?.setValue('');
    this.error = '';
    this.file = null;
    this.nit?.enable();
  }

  idmunicipioselec() {
    this.direccion?.setValue('');
    if(this.idMunic?.value == this.tempMunicId){
      this.direccion?.setValue(this.tempDir);
      console.log("temp dir ",this.tempDir)
    }else if(!this.firstTimeOpenModal){
      this.verMap();
    }
  }

  openModal(content: any, action: string, asociacion?: any) {
    this.modalMode = action;
    this.form.reset();
    console.log(asociacion)
    this.initForm();
    if (action == 'update') {
      this.idDpto?.setValue(asociacion.id_departamento);
      this.idMunic?.setValue(asociacion.id_municipio);
      this.nit?.setValue(asociacion.nit);
      this.direccion?.setValue(asociacion.direccion);
      this.infoAdicionalDir?.setValue(asociacion.informacion_adicional_direccion);
      this.nombre?.setValue(asociacion.nombre);
      this.isLegalConstituida?.setValue(asociacion.legalconstituida);
      this.fechRenvCamc?.setValue(asociacion.fecha_renovacion_camarac);
      this.fotoCamc?.setValue(asociacion.foto_camarac);
      this.idTipoAsoc?.setValue(asociacion.id_tipo_asociacion_fk);
      this.corregVereda?.setValue(asociacion.corregimiento_vereda);
      this.direccion?.setValue(asociacion.direccion);
      this.infoAdicionalDir?.setValue(asociacion.informacion_adicional_direccion);
      this.itemUpdateIndex = this.asociaciones.findIndex((element)=>element.id_negocio == asociacion.id_negocio);
      this.tempDir = this.direccion?.value;
      this.tempMunicId = this.idMunic?.value;
    }
    this.modalService
      .open(content)
      .result.then((result) => {
        console.log('se cerro modal ', result);
        this.firstTimeOpenModal = true;
      })
      .catch((err) => {89
        this.file = null;
        this.productImagePath = '';
        console.log(err);
        this.firstTimeOpenModal = true;
      });
      this.firstTimeOpenModal = false;
  }

  addAsociaciones() {
    console.log('addAsociaciones');
    console.log(this.form.getRawValue());
    console.log(this.form.controls);
    this.loading1 = true;
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }

    let ext = this.file.name.split('.')[1];
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    let basePath = '/asociaciones/camaracomecio/todas/';
    let fileName = 'asociacion-'+this.form.getRawValue().nit+'.'+ext;
    let filePath = basePath + fileName;
    console.log("file ",this.file)
    this.storage.cloudStorageTask(filePath,this.file).percentageChanges().subscribe(
      (response)=>{
        console.log(response)
        if(response == 100){
          this.storage.cloudStorageRef(filePath).getDownloadURL().subscribe(
            (downloadUrl)=>{
              console.log("download url ",downloadUrl)
              let asociacion = { ...this.form.getRawValue() }
              asociacion.foto_camarac = downloadUrl;
              this.asociacionesService.add(asociacion).subscribe(
                (response) => {
                  console.log(response)
                  window.location.reload();
                  //this.ngOnInit()
                  this.modalService.dismissAll();
                  this.loading1 = false;
                },
                (err) => {
                  this.loading1 = false;
                  console.log(err);
                  if(err.status == 400){
                    this.error = 'Ya existe una asociación con el Nit '+ asociacion.nit
                  }else{
                    this.error = 'A ocurrido un error'
                  }
                }
              );
            },err=>{
              this.loading1 = false;
              console.log(err);
            }
          )
        }
      }
    );
  /*   this.pushFileToStorage(basePath,fileName,this.file).subscribe(
      (response)=>{
        console.log('upload ',response)
      }
    ) */
  }

  fileChange(event: any) {
    console.log('change', event);
    this.file = event.target.files[0];
  }

  delete(asociacion:any) {
    this.appModalService
      .confirm(
        'Eliminar asociación',
        'Esta seguro que desea eliminar esta asociación',
        'Eliminar',
        'No estoy seguro',
        asociacion.nombre
      )
      .then((result) => {
        if (result == true) {
          this.asociacionesService.delete(asociacion.nit).subscribe(
            (response: any) => {
              let index = this.asociaciones.findIndex((element)=> element.nit == asociacion.nit)
              this.asociaciones.splice(index, 1);
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }

  updateAsociacion() {
    console.log("Actualizando!!")
    this.loading1 = true;
    this.fotoCamc?.clearValidators();
    this.fotoCamc?.updateValueAndValidity();
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.fotoCamc?.setValidators([Validators.required])
    this.fotoCamc?.updateValueAndValidity();
    if(this.fotoCamc?.invalid){
      let asociacion = { ...this.form.getRawValue() }
      asociacion.foto_camarac = this.asociaciones[this.itemUpdateIndex].foto_camarac;
      this.asociacionesService
              .update(
                this.asociaciones[this.itemUpdateIndex].nit,
                asociacion
              )
              .subscribe(
                (response) => {
                  this.loading1 = false;
                  window.location.reload();
                },
                (err) => {
                  console.log(err);
                  this.loading1 = false;
                }
              );
    }else{
      let ext = this.file.name.split('.')[1];
      let basePath = '/asociaciones/camaracomecio/todas/';
      let fileName = 'asociacion-'+this.form.getRawValue().nit+'.'+ext;
      let filePath = basePath + fileName;
      console.log("file ",this.file)
      this.storage.cloudStorageTask(filePath,this.file).percentageChanges().subscribe(
        (response)=>{
          console.log(response)
          if(response == 100){
            this.storage.cloudStorageRef(filePath).getDownloadURL().subscribe(
              (downloadUrl)=>{
                console.log("download url ",downloadUrl)
                let asociacion = { ...this.form.getRawValue() }
                asociacion.foto_camarac = downloadUrl;
                this.asociacionesService
                .update(
                  this.asociaciones[this.itemUpdateIndex].nit,
                  asociacion
                )
                .subscribe(
                  (response) => {
                    this.loading1 = false;
                    //window.location.reload();
                  },
                  (err) => {
                    console.log(err);
                    this.loading1 = false;
                  }
                );
              },err=>{
                this.loading1 = false;
                console.log(err);
              }
            )
          }
        }
      );  
    }
  }

  loadAsociaciones(){
    this.asociacionesService.tiposAsociacion().subscribe(
      (response)=>{
        this.tiposAsociaciones = response.data;
      },err=>{
        console.log(err)
      }
    )
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

  get infoAdicionalDir(){
    return this.form.get('informacion_adicional_direccion');
  }

  get nombre(){
    return this.form.get('nombre');
  }

  get isLegalConstituida(){
    return this.form.get('legalconstituida');
  }

  get fechRenvCamc(){
    return this.form.get('fecha_renovacion_camarac');
  }

  get fotoCamc(){
    return this.form.get('foto_camarac');
  }

  get idTipoAsoc(){
    return this.form.get('id_tipo_asociacion_fk');
  }

  get corregVereda(){
    return this.form.get('corregimiento_vereda');
  }

  verMap(negocio?: any) {
    if(negocio){
      let index = this.asociaciones.findIndex((element)=>element.id_negocio == negocio.id_negocio)
      this.indicenegocio = index!;
    }
    
    this.modalService
      .open(this.map, { size: 'xl', centered: true, windowClass: 'dark-modal' })
      .result.then((result) => {
        console.log('se cerro modal ', result);
        this.buscarx = '';
      })
      .catch((err) => {
        console.log(err);
        this.buscarx = '';
      });

    if(!negocio){
      this.indicenegocio = -1;
      let idMunicipio = this.idMunic?.value;
      let indexMunc = this.municipios.findIndex((element)=>element.id_municipio == idMunicipio)
      console.log("indexMunc ",indexMunc)
      console.log("idMunic ",idMunicipio)
      if(indexMunc != -1){
        let municipioNombre = this.municipios[indexMunc].nombre;
        this.buscarx = municipioNombre;
        this.buscar();
        console.log("buscar....")
      }
      return;
    }

    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    this.markerPosition = {
      lat: parseFloat(negocio.latitud),
      lng: parseFloat(negocio.longitud),
    };

    this.options = {
      center: {
        lat: parseFloat(negocio.latitud),
        lng: parseFloat(negocio.longitud),
      },
      restriction: {
        latLngBounds: sucreColombia,
        strictBounds: false,
      },
      zoom: 14,
      scrollwheel: true,
    };
    this.buscarx = '';
  }

  buscar() {
    this.loadingseart = true;
    const valor = this.buscarx;
    this.valorbuscarx = this.buscarx;
    if (valor.trim().length == 0) {
      this.loadingseart = false;
      return;
    }

    this.geocoder
      .geocode({
        address: `${valor}`,
      })
      .subscribe(({ results }) => {
        console.log(results);
        if (results.length === 0) {
          this.loadingseart = false;
          this.noexistendatos = true;
          this.fueraDirecion = false;
          setTimeout(() => {
            this.noexistendatos = false;
          }, 10000);
        } else {
          this.loadingseart = false;
          this.fueraDirecion = false;
          const point: google.maps.LatLngLiteral = {
            lat: results[0].geometry.location.toJSON().lat!,
            lng: results[0].geometry.location.toJSON().lng!,
          };

          this.places.geocodeLatLng(point).then((response) => {
            if (response.status == 'OK') {
              let result = response.results[0].address_components;
              let index = result.findIndex((element) =>
                element.types.includes('administrative_area_level_1')
              );
              let dpto = result[index].short_name;
              index = result.findIndex((element) =>
                element.types.includes('administrative_area_level_2')
              );
              index = this.departamentos.findIndex(
                (element) => element.nombre_departamento == dpto
              );
              if (dpto == 'Sucre') {
                if (
                  results[0].geometry.location.toJSON().lat! &&
                  results[0].geometry.location.toJSON().lng!
                ) {
                  this.options = {
                    center: {
                      lat: results[0].geometry.location.toJSON().lat!,
                      lng: results[0].geometry.location.toJSON().lng!,
                    },
                    zoom: 13,
                  };
                }
              } else {
                this.loadingseart = false;
                this.fueraDirecion = true;
                this.noexistendatos = false;
                setTimeout(() => {
                  this.fueraDirecion = false;
                }, 5000);
              }
            }
          });
        }
      });
  }
  borrarBusqueda() {
    this.buscarx = '';
    this.borrarseart = false;
    this.fueraDirecion = false;
    this.noexistendatos = false;
  }
  onKey(event: any) {
    if (event.target.value !== '') {
      this.borrarseart = true;
    } else if (event.target.value == '') {
      this.borrarseart = false;
    }
  }
  // Metodo para adicionar una marca en el mapa
  addMarker(event: google.maps.MapMouseEvent) {
    this.guarlatlog = false;
    const point: google.maps.LatLngLiteral = {
      lat: event.latLng?.toJSON().lat!,
      lng: event.latLng?.toJSON().lng!,
    };
    this.places.geocodeLatLng(point).then((response) => {
      if (response.status == 'OK') {
        console.log(response);
        console.log(this.municipios);
        let result = response.results[0].address_components;
        console.log('administrative_area_level_1');
        let index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_1')
        );
        console.log(`departamento indice${index}`);
        let dpto = result[index].short_name;
        console.log(`departamento ${dpto}`);
        /* municipio */
        console.log('administrative_area_level_2');
        index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_2')
        );
        console.log(`municipio indice ${index}`);
        let municipio = result[index].short_name;
        console.log(`municipio ${municipio}`);
        /*  index = this.departamentos.findIndex(
          (element) => element.nombre_departamento == dpto
        );
        let idDpto = this.departamentos[index]?.id_departamento; */
        /* id munisipio */
        index = this.municipios.findIndex(
          (element) => element.nombre == municipio
        );
        console.log(`munisipio indice id ${index}`);
        let idMunipio = this.municipios[index]?.id_municipio;
        console.log(`munisipio id ${idMunipio}`);

        if (dpto == 'Sucre') {
          this.markerPosition = {
            lat: event.latLng!.toJSON().lat,
            lng: event.latLng!.toJSON().lng,
          };
          this.asociaciones[this.indicenegocio!];
          this.fueraDirecion = false;

          this.confirmModalMapService
            .confirm(
              '../../../../assets/icons/editar.svg',
              '../../../../assets/icons/save.svg',
              'Actualizar  mi ubicación',
              'Estás a punto de cambiar tu ubicación, ¿estás seguro de realizar este cambio?',
              'Si',
              'No estoy seguro'
            )
            .then((result) => {
              console.log(result);
              if (result == true) {
                if(this.indicenegocio == -1){
                  this.direccion?.setValue(response.results[0].formatted_address);
                  this.idMunic?.setValue(idMunipio)
                }else{
                  /*this.asociacionesService
                  .updateParcialNegocio(this.asociaciones[this.indicenegocio!].id_negocio, {
                    latitud: event.latLng!.toJSON().lat,
                    longitud: event.latLng!.toJSON().lng,
                    id_municipio:idMunipio,
                    direccion: response.results[0].formatted_address
                  })
                  .subscribe(
                    (response) => {
                      console.log(response);
                      this.tempDir = this.direccion?.value;
                      this.tempMunicId = this.idMunic?.value;
                      window.location.reload();
                    },
                    (err) => {
                      this.guarlatlog = true;
                      setTimeout(() => {
                        this.guarlatlog = false;
                      }, 5000);
                      console.log(err);
                    }
                  );*/
                }
              } else {
                this.markerPosition = {
                  lat: parseFloat(this.asociaciones[this.indicenegocio!].latitud),
                  lng: parseFloat(this.asociaciones[this.indicenegocio!].longitud),
                };
              }
            })
            .catch((result) => {});
        } else {
          this.noexistendatos = false;
          this.fueraDirecion = true;
          setTimeout(() => {
            this.fueraDirecion = false;
          }, 5000);
        }
      }
    });
  }

  async loadPhotos(event: any) {
    this.loading2 = true;
    try {
      let fileNameBase =
        '/negocios/User' +
        this.authUserId +
        '/negocio' +
        this.asociaciones[this.itemUpdateIndex].id_negocio +
        '/foto';
      let files: Array<any> = event.target.files;
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
      }
      this.photosNegocioArray = this.photosNegocioArray.concat(arrayFotos);
      if (this.photosNegocioArray.length < 1) {
        this.showNotFoundPhotos = true;
      } else {
        this.showNotFoundPhotos = false;
      }
      this.loading2 = false;
      this.photosUpdate();
    } catch (err) {
      this.loading2 = false;
    }
  }

  openAddFileDialog() {
    const element: HTMLElement = this.inputFileDialog.nativeElement;
    element.click();
  }

  openPhotosModal(content: any, negocio:any) {
    let index = this.asociaciones.findIndex((element)=>element.id_negocio == negocio.id_negocio);
    this.itemUpdateIndex = index;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-photo',
      })
      .result.then(
        (result) => {
          console.log(result);
        },
        (reason) => {
          console.log(reason);
        }
      );
    this.photosNegocioArray = [];
    this.loading1 = true;

    this.photosNegocioArray = this.asociaciones[index].fotos;
    console.log("arrayFotosNegocio ",this.photosNegocioArray)
    if(this.photosNegocioArray.length == 0){
      this.showNotFoundPhotos = true;
    }else{
      this.showNotFound = false;
    }

    this.loading1 = false;
    this.asociacionesService.detail(this.asociaciones[index].id_negocio)
      .subscribe(
        (response) => {
          this.photosNegocioArray = response.data[0].fotos_negocio;
          this.loading1 = false;
          this.showNotFoundPhotos = false;
          if (this.photosNegocioArray.length < 1) {
            this.showNotFoundPhotos = true;
          }
        },
        (err) => {
          this.loading1 = false;
          this.showNotFoundPhotos = false;
        }
      );
  }

  photosUpdate() {
    this.loading2 = true;
    /*this.asociacionesService
      .updatePhotos(this.asociaciones[this.itemUpdateIndex].id_negocio, this.photosNegocioArray)
      .subscribe(
        (response) => {
          this.loading2 = false;
          console.log(response);
        },
        (err) => {
          this.loading2 = false;
          console.log(err);
        }
      );*/
  }

  onLongPressing(event: number) {
    console.log(event);
  }

  onLongPress() {
    this.isPhotoSelectingToDel = true;
  }

  onReleasePressing() {}

  abortDeleting() {
    this.isPhotoSelectingToDel = false;
    this.photosNegocioUrlToDel = [];
  }

  addPhotoToDel(photoUrl: string) {
    if (!this.isPhotoSelectingToDel) {
      return;
    }
    let i = this.photosNegocioUrlToDel.indexOf(photoUrl);
    if (i > -1) {
      this.photosNegocioUrlToDel.splice(i, 1);
    } else {
      this.photosNegocioUrlToDel.push(photoUrl);
    }
  }

  isPhotoIncludeToDelete(photoUrl: string) {
    return this.photosNegocioUrlToDel.includes(photoUrl);
  }

  photosDelete() {
    this.loading3 = true;
    console.log(this.photosNegocioArray);
    this.photosNegocioArrayCopy = this.photosNegocioArray.slice(0);
    this.photosNegocioUrlToDel.forEach((photo) => {
      let index = this.photosNegocioArrayCopy.indexOf(photo);
      if (index > -1) {
        this.photosNegocioArrayCopy.splice(index, 1);
      }
    });
    console.log(this.photosNegocioArrayCopy);
    /*this.asociacionesService
      .updatePhotos(this.asociaciones[this.itemUpdateIndex].id_negocio,this.photosNegocioArrayCopy)
      .subscribe(
        (response) => {
          this.photosNegocioArray = this.photosNegocioArrayCopy;
          this.photosNegocioUrlToDel = [];
          this.isPhotoSelectingToDel = false;
          this.loading3 = false;
          if (this.photosNegocioArray.length < 1) {
            this.showNotFoundPhotos = true;
          }
        },
        (err) => {
          console.log(err);
          this.loading3 = false;
        }
      );*/
  }

  detalleAsociacion(action: string, asociacion?: any) {
    this.modalMode = action;
    this.form.reset();
    console.log(asociacion)
    this.initForm();
    if (action == 'update') {
      this.idDpto?.setValue(asociacion.id_departamento);
      this.idMunic?.setValue(asociacion.id_municipio);
      this.nit?.setValue(asociacion.nit);
      this.direccion?.setValue(asociacion.direccion);
      this.infoAdicionalDir?.setValue(asociacion.informacion_adicional_direccion);
      this.nombre?.setValue(asociacion.nombre);
      this.isLegalConstituida?.setValue(asociacion.legalconstituida);
      this.fechRenvCamc?.setValue(formatDate(asociacion?.fecha_renovacion_camarac,'yyyy-MM-dd','es'));
      //this.fotoCamc?.setValue(asociacion.foto_camarac);
      this.idTipoAsoc?.setValue(asociacion.id_tipo_asociacion_fk);
      this.corregVereda?.setValue(asociacion.corregimiento_vereda);
      this.direccion?.setValue(asociacion.direccion);
      this.infoAdicionalDir?.setValue(asociacion.informacion_adicional_direccion);
      this.itemUpdateIndex = this.asociaciones.findIndex((element)=>element.nit == asociacion.nit);
      this.tempDir = this.direccion?.value;
      this.tempMunicId = this.idMunic?.value;
      this.nit?.disable();
    }
    this.showDetalleAsociacion = true;
  }

  agregarMiembro(){
    this.asociacionesService.showSolicitudesModal(this.nit?.value, 'Agregar miembro');
  }
}
