import { Component, OnInit ,  ElementRef,
  ViewChild, } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer} from '@angular/platform-browser';
import {  NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
const _ = require('lodash');

@Component({
  selector: 'app-mis-granjas',
  templateUrl: './mis-granjas.component.html',
  styleUrls: ['./mis-granjas.component.scss'],
})
export class MisGranjasComponent implements OnInit {
  @ViewChild('myselecmunicipio') myselecmunicipio!: ElementRef;
  @ViewChild('map') map: any;
  @ViewChild('fileInput') inputFileDialog!: ElementRef;
  granjas: Array<any> = [];
  showNotFound: boolean = false;
  indicegranja!: number;
  guarlatlog: boolean = false;
  noexistendatos: boolean = false;
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  valorbuscarx: string = '';
  mylatitudidmunicipio!: number;
  mylongitudidmunicipio!: number;
  faltanargumentos: boolean = false;
  faltadireccion: boolean = false;
  modal!: NgbModalRef;
  p!: number;
  form: FormGroup = new FormGroup({
    nombre_granja: new FormControl('', [Validators.required]),
    area: new FormControl(0, [Validators.required]),
    numero_trabajadores: new FormControl(0, [Validators.required]),
    produccion_estimada_mes: new FormControl(0, [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    informacion_adicional_direccion:new FormControl('',[Validators.required]),
    latitud: new FormControl(0, [Validators.required]),
    longitud: new FormControl(0, [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    id_vereda: new FormControl(0),
    id_corregimiento: new FormControl(0),
    corregimiento_vereda: new FormControl(''),
    arrayTiposInfraestructuras: new FormArray([]),
    arrayEspecies: new FormArray([]),
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
  disableinput = false;
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
  photosGranjaArray: Array<string> = [];
  photosGranjaArrayCopy: Array<string> = [];
  photosGranjaUrlToDel: Array<string> = [];
  isPhotoSelectingToDel: boolean = false;
  indexSelectedToDel: Array<number> = [];
  showNotFoundPhotos: boolean = false;
  timeLapsed1: number = 0;
  escogerdireccion: boolean=false;

  constructor(
    private granjaService: GranjasService,
    private modalService: NgbModal,
    private storage: FirebaseStorageService,
    private sanitizer: DomSanitizer,
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
   this. autorecarga()
   }
  autorecarga(): void {
    this.direccion?.disable();
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.granjaService.getGranjaByUserId(payload.sub).subscribe(
      (respose) => {
        this.granjas = respose.data;
        console.log(this.granjas)
        if (this.granjas.length < 1) {
          this.showNotFound = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );

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
  }

  initForm() {
    this.idmunicipioselec();
    this.nombreGranja?.setValue('');
    this.area?.setValue(0);
    this.numeroTrabajadores?.setValue(0);
    this.prodEstimadaMes?.setValue(0);
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
  /* mi codigo */

  /* fin */
  openModal(content: any, action: string, idGranja?: number) {
    this.faltanargumentos=false;
    this.faltadireccion = false;
    this.disableinput = true;
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
    this.modalMode = action;
    this.form.reset();
    this.initForm();
    this.idDpto?.setValue(70);
    if (action == 'update') {
      this.granjaService
        .getGranjaDetalle(this.granjas[index!].id_granja)
        .subscribe((granja) => {
          let granjaDetalle = granja.data[0];
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

      this.itemUpdateIndex = index!;
    }
    this.modalService
      .open(content)
      .result.then((result) => {
        console.log('se cerro modal ', result);
      })
      .catch((err) => {
        this.file = null;
        this.productImagePath = '';
      });
  }
  idmunicipioselec() {
    if (this.modalMode == 'update') {
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              if (
                this.form.get('id_municipio')?.value !==
                this.granjas[this.itemUpdateIndex].id_municipio
              ) {
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
                this.direccion?.setValue('');
                this.verMapaDireccion()
                this.escogerdireccion = true;
                setTimeout(() => {
                  this.escogerdireccion = false;
                }, 30000);
                this.faltadireccion = true;
              } else {
                this.latitud?.setValue(
                  this.granjas[this.itemUpdateIndex].latitud
                );
                this.longitud?.setValue(
                  this.granjas[this.itemUpdateIndex].longitud
                );
                this.direccion?.setValue(
                  this.granjas[this.itemUpdateIndex].direccion
                );
                this.faltadireccion = false;
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (this.modalMode == 'create') {
      this.faltanargumentos = false;
      console.log(this.modalMode);
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
              this.escogerdireccion=true
              setTimeout(() => {
                this.escogerdireccion = false;
              }, 30000);
              this.mylatitudidmunicipio = response.data[0].latitud;
              this.mylongitudidmunicipio = response.data[0].longitud;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  addGranja() {
    this.loading1 = true;
    if (!this.form.valid) {
         if (this.form.getRawValue().direccion == '') {
           this.faltadireccion = true;
         }else{
          this.faltadireccion = false;
         }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
 if (this.form.getRawValue().direccion !== '') {
   this.faltadireccion = false;
   this.granjaService.addGranja(this.form.getRawValue()).subscribe(
     (response) => {
       let nuevaGranjainsertId = _.clone(this.form.getRawValue());
       nuevaGranjainsertId.id_granja = response.body.insertId;
       nuevaGranjainsertId.nombre = this.form.getRawValue().nombre_granja;
       this.loading1 = false;
       this.granjas.push(nuevaGranjainsertId);
     if (this.granjas.length >= 1) {
       this.showNotFound = false;
     }

       this.modalService.dismissAll();
     },
     (err) => {
       this.loading1 = false;
       console.log(err);
     }
   );
 } else {
  this.loading1 = false;
   this.faltadireccion = true;
 }
  }

  fileChange(event: any) {
    console.log('change', event);
    this.file = event.target.files[0];
    /* let productImagePath:any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]))
    console.log(productImagePath.changingThisBreaksApplicationSecurity) */
    //this.productImagePath = productImagePath.changingThisBreaksApplicationSecurity;
  }

  deleteGranja(idGranja: number) {
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
    this.appModalService
      .confirm(
        'Eliminar granja',
        'Esta seguro que desea eliminar la granja',
        'Eliminar',
        'No estoy seguro',
        this.granjas[index].nombre
      )
      .then((result) => {
        if (result == true) {
          this.granjaService.deleteGranja(idGranja).subscribe(
            (response: any) => {
              this.granjas.splice(index, 1);
              if (this.granjas.length <= 0) {
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

  updateGranja() {
    this.loading1 = true;
    if (!this.form.valid) {
      if (this.form.getRawValue().direccion=='') {
        this.faltadireccion = true;
      }else{
        this.faltadireccion = false;
      }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
if (this.form.getRawValue().direccion !== '') {
  this.faltadireccion = false;
  this.granjaService
    .updateGranja(
      this.granjas[this.itemUpdateIndex].id_granja,
      this.form.getRawValue()
    )
    .subscribe(
      (response) => {
        this.loading1 = false;
        this.autorecarga();
        this.modalService.dismissAll();
      },
      (err) => {
        console.log(err);
        this.loading1 = false;
      }
    );
} else {
  this.loading1 = false;
  this.faltadireccion = true;
}
    //this.proveedorService.updateProducto(this.form)
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

  verMap(idGranja?: number) {
     this.faltadireccion = false;
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
    this.modalMode = 'updateporvermapa';
    this.indicegranja = index!;
    this.modal = this.modalService.open(this.map, {
      size: 'xl',
      centered: true,
      windowClass: 'dark-modal',
    });
    this.modal.result
      .then((result) => {
        console.log('se cerro modal ', result);
      })
      .catch((err) => {
        console.log(err);
      });
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    this.markerPosition = {
      lat: parseFloat(this.granjas[index!].latitud),
      lng: parseFloat(this.granjas[index!].longitud),
    };

    this.options = {
      center: {
        lat: parseFloat(this.granjas[index!].latitud),
        lng: parseFloat(this.granjas[index!].longitud),
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
  verMapaDireccion() {
    this.faltadireccion = false;
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    if (this.modalMode == 'update') {
      this.modal = this.modalService.open(this.map, {
        size: 'xl',
        centered: true,
        windowClass: 'dark-modal',
      });
      this.modal.result
        .then((result) => {
          console.log('se cerro modal ', result);
        })
        .catch((err) => {
          console.log(err);
        });
      this.markerPosition = {
        lat: Number(this.form.get('latitud')?.value),
        lng: Number(this.form.get('longitud')?.value),
      };

      this.options = {
        center: {
          lat: Number(this.form.get('latitud')?.value),
          lng: Number(this.form.get('longitud')?.value),
        },
        restriction: {
          latLngBounds: sucreColombia,
          strictBounds: false,
        },
        zoom: 14,
        scrollwheel: true,
      };
    } else if (this.modalMode == 'create') {

      if (
        this.form.getRawValue().latitud &&
        this.form.getRawValue().latitud !== ''
      ) {
        this.faltanargumentos = false;

        this.modal = this.modalService.open(this.map, {
          size: 'xl',
          centered: true,
          windowClass: 'dark-modal',
        });
        this.modal.result
          .then((result) => {
            console.log('se cerro modal ', result);
          })
          .catch((err) => {
            console.log(err);
          });
        if (
          this.form.get('latitud')?.value == this.mylatitudidmunicipio &&
          this.form.get('longitud')?.value == this.mylongitudidmunicipio
        ) {
          this.markerPosition = {
            lat: Number(this.mylatitudidmunicipio),
            lng: Number(this.mylongitudidmunicipio),
          };

          this.options = {
            center: {
              lat: Number(this.mylatitudidmunicipio),
              lng: Number(this.mylongitudidmunicipio),
            },
            restriction: {
              latLngBounds: sucreColombia,
              strictBounds: false,
            },
            zoom: 14,
            scrollwheel: true,
          };
        } else {
          this.markerPosition = {
            lat: Number(this.form.get('latitud')?.value),
            lng: Number(this.form.get('longitud')?.value),
          };

          this.options = {
            center: {
              lat: Number(this.form.get('latitud')?.value),
              lng: Number(this.form.get('longitud')?.value),
            },
            restriction: {
              latLngBounds: sucreColombia,
              strictBounds: false,
            },
            zoom: 14,
            scrollwheel: true,
          };
        }
      } else {
        this.faltanargumentos = true;
      }
    }
    this.buscarx = '';
  }
  closeMap() {
    this.modal.close();
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
                  this.markerPosition = {
                    lat: results[0].geometry.location.toJSON().lat!,
                    lng: results[0].geometry.location.toJSON().lng!,
                  };
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
     this.escogerdireccion = false;
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
        /* munisipio */
        console.log('administrative_area_level_2');
        index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_2')
        );
        console.log(`munisipio indice ${index}`);
        let municipio = result[index].short_name;
        console.log(`munisipio ${municipio}`);
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
          this.fueraDirecion = false;
          this.markerPosition = {
            lat: event.latLng!.toJSON().lat,
            lng: event.latLng!.toJSON().lng,
          };
          /* console.log(this.granjas[this.indicegranja!]); */
          if (this.modalMode == 'update') {
            this.confirmModalMapService
              .confirm(
                '../../../../assets/icons/editar.svg',
                '../../../../assets/icons/save.svg',
                'Actualizar  mi ubicación',
                'Estás a punto de cambiar tu ubicación por: ',
                'Si',
                'No estoy seguro',
                `${response.results[0].formatted_address}`
              )
              .then((result) => {
                if (result == true) {
                  if (this.form.get('id_municipio')?.value == idMunipio) {
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.closeMap();
                  } else {
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.idMunic?.setValue(idMunipio);
                    this.closeMap();
                  }
                } else {
                  if (
                    this.form.get('latitud')?.value ==
                      this.mylatitudidmunicipio &&
                    this.form.get('longitud')?.value ==
                      this.mylongitudidmunicipio
                  ) {
                    this.markerPosition = {
                      lat: Number(this.mylatitudidmunicipio),
                      lng: Number(this.mylongitudidmunicipio),
                    };
                  } else {
                    this.markerPosition = {
                      lat: Number(this.form.get('latitud')?.value),
                      lng: Number(this.form.get('longitud')?.value),
                    };
                  }
                }
              })
              .catch((result) => {});
          } else if (this.modalMode == 'create') {
            this.confirmModalMapService
              .confirm(
                '../../../../assets/icons/iconoubicacion.svg',
                '../../../../assets/icons/save.svg',
                'Escoger ubicación',
                `Estás a punto de escoger la siguiente ubicación:`,
                'Si',
                'No estoy seguro',
                `${response.results[0].formatted_address}`
              )
              .then((result) => {
                if (result == true) {
                  if (this.form.get('id_municipio')?.value == idMunipio) {
                    console.log('igual');
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.closeMap();
                  } else {
                    console.log('difrente');
                    this.latitud?.setValue(event.latLng!.toJSON().lat);
                    this.longitud?.setValue(event.latLng!.toJSON().lng);
                    this.direccion?.setValue(
                      response.results[0].formatted_address
                    );
                    this.idMunic?.setValue(idMunipio);
                    this.closeMap();
                  }
                } else {
                  if (
                    this.form.get('latitud')?.value ==
                      this.mylatitudidmunicipio &&
                    this.form.get('longitud')?.value ==
                      this.mylongitudidmunicipio
                  ) {
                    this.markerPosition = {
                      lat: Number(this.mylatitudidmunicipio),
                      lng: Number(this.mylongitudidmunicipio),
                    };
                  } else {
                    this.markerPosition = {
                      lat: Number(this.form.get('latitud')?.value),
                      lng: Number(this.form.get('longitud')?.value),
                    };
                  }
                }
              })
              .catch((result) => {});
          } else if (this.modalMode == 'updateporvermapa') {
            this.confirmModalMapService
              .confirm(
                '../../../../assets/icons/editar.svg',
                '../../../../assets/icons/save.svg',
                'Actualizar  mi ubicación',
                'Estás a punto de cambiar tu ubicación por: ',
                'Si',
                'No estoy seguro',
                `${response.results[0].formatted_address}`
              )
              .then((result) => {
                if (result == true) {
                  this.granjaService
                    .updateParcial(this.granjas[this.indicegranja!].id_granja, {
                      latitud: event.latLng!.toJSON().lat,
                      longitud: event.latLng!.toJSON().lng,
                      id_municipio: idMunipio,
                      direccion: response.results[0].formatted_address,
                    })
                    .subscribe(
                      (response) => {
                        this.autorecarga();
                      },
                      (err) => {
                        this.guarlatlog = true;
                        setTimeout(() => {
                          this.guarlatlog = false;
                        }, 5000);
                        console.log(err);
                      }
                    );
                } else {
                  this.markerPosition = {
                    lat: parseFloat(this.granjas[this.indicegranja!].latitud),
                    lng: parseFloat(this.granjas[this.indicegranja!].longitud),
                  };
                }
              })
              .catch((result) => {});
          }
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
        '/granjas/User' +
        this.authUserId +
        '/granja' +
        this.granjas[this.itemUpdateIndex].id_granja +
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
      this.photosGranjaArray = this.photosGranjaArray.concat(arrayFotos);
      if (this.photosGranjaArray.length < 1) {
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

  openPhotosModal(content: any, idGranja: number) {
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
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
    this.photosGranjaArray = [];
    this.loading1 = true;
    this.granjaService
      .getGranjaDetalle(this.granjas[index].id_granja)
      .subscribe(
        (response) => {
          this.photosGranjaArray = response.data[0].fotos;
          this.loading1 = false;
          this.showNotFoundPhotos = false;
          if (this.photosGranjaArray.length < 1) {
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
    this.granjaService
      .updatePhotos(this.granjas[this.itemUpdateIndex].id_granja, {
        arrayFotos: this.photosGranjaArray,
      })
      .subscribe(
        (response) => {
          this.loading2 = false;
          console.log(response);
        },
        (err) => {
          this.loading2 = false;
          console.log(err);
        }
      );
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
    this.photosGranjaUrlToDel = [];
  }

  addPhotoToDel(photoUrl: string) {
    if (!this.isPhotoSelectingToDel) {
      return;
    }
    let i = this.photosGranjaUrlToDel.indexOf(photoUrl);
    if (i > -1) {
      this.photosGranjaUrlToDel.splice(i, 1);
    } else {
      this.photosGranjaUrlToDel.push(photoUrl);
    }
  }

  isPhotoIncludeToDelete(photoUrl: string) {
    return this.photosGranjaUrlToDel.includes(photoUrl);
  }

  photosDelete() {
    this.loading3 = true;
    this.photosGranjaArrayCopy = this.photosGranjaArray.slice(0);
    this.photosGranjaUrlToDel.forEach((photo) => {
      let index = this.photosGranjaArrayCopy.indexOf(photo);
      if (index > -1) {
        this.photosGranjaArrayCopy.splice(index, 1);
      }
    });
    console.log(this.photosGranjaArrayCopy);
    this.granjaService
      .updatePhotos(this.granjas[this.itemUpdateIndex].id_granja, {
        arrayFotos: this.photosGranjaArrayCopy,
      })
      .subscribe(
        (response) => {
          this.photosGranjaArray = this.photosGranjaArrayCopy;
          this.photosGranjaUrlToDel = [];
          this.isPhotoSelectingToDel = false;
          this.loading3 = false;
          if (this.photosGranjaArray.length < 1) {
            this.showNotFoundPhotos = true;
          }
        },
        (err) => {
          console.log(err);
          this.loading3 = false;
        }
      );
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
  get informacionAdicionalDireccion(){
return this.form.get('informacion_adicional_direccion');
  }
}
