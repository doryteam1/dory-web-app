import { Component,OnInit,HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GranjasService } from '../../services/granjas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utilities } from 'src/app/utilities/utilities';

import { ModalGallerySliderService } from '../../../shared/services/modal-gallery-slider.service';
import { PlatformLocation } from '@angular/common'
@Component({
  selector: 'app-granja-detalle',
  templateUrl: './granja-detalle.component.html',
  styleUrls: ['./granja-detalle.component.scss'],
})
export class GranjaDetalleComponent implements OnInit {
  granja: any;
  fotosgranja: any = [];
  showNotFound: boolean = false;
  showError: boolean = false;
  selectedGranjaId: number = -1;
  errorMessage = '';
  showGallery:boolean = false;
  imgsele:boolean=false
  indice!:number
  tiempo:any
  imgmauseover:boolean=false
  showconte:boolean=false
  imgselecmodal!:number
  resenas:any = [];
  showErrorFound: boolean = false;
  puntuacion: any;
  rating: number = -1;
  descResena:string = '';
  loading: boolean = false;
  success:boolean = false;
  shadoweffectindice!: number;
  showconteslaider: boolean = false;
  valorindicecarrucel!: number;
  singranjas: boolean = false;

  constructor(
    private granjasService: GranjasService,
    private activatedRoute: ActivatedRoute,
    private modalGallerySliderService: ModalGallerySliderService,
    public location: PlatformLocation,
    private modalService: NgbModal
  ){


  }
  ngOnInit(): void {
    this.selectedGranjaId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    console.log(this.selectedGranjaId);
    this.granjasService.getGranjaDetalle(this.selectedGranjaId).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.granja = response.data[0];
          this.fotosgranja = response.data[0].fotos;
          if (this.fotosgranja.length == 0) {
            this.singranjas = true;
          }
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        this.showNotFound = false;
        this.showError = false;
        if (err.status == 404) {
          this.showNotFound = true;
        } else {
          this.showError = true;
          this.errorMessage = 'Error inesperado';
        }
      }
    );

    this.granjasService.resenasById(this.selectedGranjaId).subscribe(
      (response)=>{
        this.resenas = response.data.resenas;
        this.puntuacion = response.data.puntaje;
        if(this.resenas.length < 1){
          this.showNotFound = true;
        }else{
          this.showNotFound = false;
        }
      },err=>{
        this.showNotFound = false;
        this.showErrorFound = true;
        console.log(err)
      }
    )
  }

  imgSelecionadaModal(i:number){
    this.imgselecmodal=i
    clearInterval(this.tiempo)
     this.indice=-1
     this.showconte=true
  }
  imgMause(){
    this.imgmauseover=true
     this.indice=-1

  }

  openQualifyModal(content:any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass:'qualify-modal' , scrollable: true,centered: true}).result.then((result) => {
    console.log(result)
    }, (reason) => {
      console.log(reason)
    });
  }

  changeFavorite(){
    this.granja.favorita = this.granja.favorita == 1 ? 0 : 1;
    this.granjasService.esFavorita(this.granja.id_granja).subscribe(
      (response)=>{
      },err=>{
        console.log(err)
        this.granja.favorita = this.granja.favorita == 1 ? 0 : 1;
      }
    )
  }

  showResenas(idGranja:number){
    this.granjasService.showResenasModal('Reseñas','Cerrar',idGranja);
  }

  onRating(event:number){
    console.log(event)
    this.rating = event;
  }

  publicarResena(){
    let resena = {
      id_granja:this.granja.id_granja,
      descripcion:this.descResena,
      fecha:Utilities.dateTimeNow()
    }
    this.loading = true;
    this.granjasService.addResena(resena).subscribe(
      (response)=>{
        this.granjasService.calificarGranja(this.granja.id_granja,this.rating).subscribe(
          response=>{
            this.loading = false;
            this.success = true;
          },err=>{
            this.loading = false;
          }
        )
      },err=>{
        this.loading = false;
      }
    )
  }
@HostListener('window:popstate', ['$event']) onPopState(event:any) {
 /* this.modalGallerySliderService.closeModal(); */
  if (this.modalGallerySliderService) {
    /*  this.location.back(); */
    console.log('hello');
  }
}


  fotoSele(i: number) {
    this.shadoweffectindice = i;
    this.imgselecmodal = -1;
    this.valorindicecarrucel = -1;
    this.openGaleriaModal();
  }
  openGaleriaModalOtro() {
    this.shadoweffectindice = -1;
    this.valorindicecarrucel = -1;
    this.imgselecmodal = -1;
    this.openGaleriaModal();
  }

  openGaleriaModal() {
     this.location.onPopState(() => {
       console.log('pressed back!');
       this.modalGallerySliderService.closeModal();
      //  detecta  cuando se da click atras detecta y cierra la cualquiera modal activa
     });
  /*  console.log( this.location.pushState(null, '', location.pathname)) */
   /* bloque el boton de atras navegador */

    this.showconteslaider = false;
    this.modalGallerySliderService
      .confirm(
        this.shadoweffectindice,
        this.imgselecmodal,
        this.valorindicecarrucel,
        this.showconteslaider,
        this.granja,
        this.fotosgranja
      )
      .then((result) => {
      })
      .catch((result) => {});
    /*    history.pushState(null, '', window.location.pathname); */
  }
}






