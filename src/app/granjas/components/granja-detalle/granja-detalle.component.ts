import { Component,OnInit,HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GranjasService } from '../../services/granjas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utilities } from 'src/app/utilities/utilities';

import { ModalGallerySliderService } from '../../../shared/services/modal-gallery-slider.service';
import { PlatformLocation } from '@angular/common'
import { AppModalService } from '../../../shared/services/app-modal.service';
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
  showGallery: boolean = false;
  imgsele: boolean = false;
  indice!: number;
  tiempo: any;
  imgmauseover: boolean = false;
  showconte: boolean = false;
  imgselecmodal!: number;
  resenas: Array<any> = [];
  showErrorFound: boolean = false;
  puntuacion: any;
  rating: number = -1;
  descResena: string = '';
  loading: boolean = false;
  success: boolean = false;
  shadoweffectindice!: number;
  showconteslaider: boolean = false;
  valorindicecarrucel!: number;
  singranjas: boolean = false;
  userToken:string | null = '';
  authUserId:number = -1;
  miresena:any;
  editedDescResena:string = '';
  editingMiResena:boolean = false;
  constructor(
    private granjasService: GranjasService,
    private activatedRoute: ActivatedRoute,
    private modalGallerySliderService: ModalGallerySliderService,
    public location: PlatformLocation,
    private modalService: NgbModal,
    private appModalService:AppModalService,
  ) {}

  ngOnInit(): void {
    this.selectedGranjaId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.userToken = localStorage.getItem('token')
    if(this.userToken){
      let payload = Utilities.parseJwt(this.userToken);
      this.authUserId = payload.sub;
      this.granjasService.resenasUserByIdGranja(this.selectedGranjaId).subscribe(
        (response)=>{
          this.miresena = response.data.resena;
          this.editedDescResena = this.miresena?.descripcion;
        },err=>{

        }
      )
    }
    
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
      (response) => {
        this.resenas = response.data.resenas;
        this.puntuacion = response.data.puntaje;
        if (this.resenas.length < 1) {
          this.showNotFound = true;
        } else {
          this.showNotFound = false;
        }
      },
      (err) => {
        this.showNotFound = false;
        this.showErrorFound = true;
        console.log(err);
      }
    );
  }
  fotoSele(i: number) {
    this.shadoweffectindice = i;
    this.imgselecmodal = -1;
    this.valorindicecarrucel = -1;
    this.OpenGalleryModalOptionOne();
  }
  imgSelecionadaModal(i: number) {
    this.imgselecmodal = i;
    clearInterval(this.tiempo);
    this.indice = -1;
    this.showconte = true;
  }
  imgMause() {
    this.imgmauseover = true;
    this.indice = -1;
  }

  openQualifyModal(content: any, editingMiResena?:number) {
    if(editingMiResena && editingMiResena == 1){
      this.rating = this.miresena.calificacion;
      this.descResena = this.miresena.descripcion;
      this.editingMiResena = true;
    }else{
      this.editingMiResena = false;
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'qualify-modal',
        scrollable: true,
        centered: true,
      })
      .result.then(
        (result) => {
          console.log("result ",result);
          this.success = false;
          this.descResena = '';
          this.editingMiResena = false;
          window.location.reload()
        },
        (reason) => {
          this.success = false;
          console.log("reason ",reason);
          this.descResena = '';
          this.editingMiResena = false;
          window.location.reload()
        }
      );
  }

  changeFavorite() {
    this.granja.favorita = this.granja.favorita == 1 ? 0 : 1;
    this.granjasService.esFavorita(this.granja.id_granja).subscribe(
      (response) => {},
      (err) => {
        console.log(err);
        this.granja.favorita = this.granja.favorita == 1 ? 0 : 1;
      }
    );
  }

  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }

  onRating(event: number) {
    console.log(event);
    this.rating = event;
  }

  publicarResena(){
    if(this.rating < 1 ){
      return;
    }
    let resena = {
      id_granja:this.granja.id_granja,
      descripcion:this.descResena,
      fecha:Utilities.dateNow(),
      calificacion:this.rating
    }
    this.loading = true;
    console.log(resena)

    if(this.editingMiResena){
      this.granjasService.updateResena(resena, this.miresena.id).subscribe(
        (respose)=>{
          this.loading = false;
          this.success = true;
        },err=>{
          this.loading = false;
        }
      );
    }else{
      this.granjasService.addResena(resena).subscribe(
        (respose)=>{
          /*this.resenas.push(resena)
          let calif = this.acumCalif();
          calif += resena.calificacion;
          calif = calif / (this.granja.resenas.length + 1); */
          this.loading = false;
          this.success = true;
        },err=>{
          this.loading = false;
        }
      );
    }
  }

  acumCalif(){
    let calif = 0;

    this.granja.resenas.forEach((resena:any) => {
      calif += resena.calificacion;
    });
    return calif;
  }
  // @HostListener('window:popstate', ['$event']) onPopState(event: any) {
  //   // this.modalGallerySliderService.closeModal();
  //   if (this.modalGallerySliderService) {
  //     //  this.location.back();
  //     console.log('hello');
  //   }
  // }

  OpenGalleryModalOptionTwo() {
    this.shadoweffectindice = -1;
    this.valorindicecarrucel = -1;
    this.imgselecmodal = -1;
    this.OpenGalleryModalOptionOne();
  }

  OpenGalleryModalOptionOne(){
    this.location.onPopState(() => {
      console.log('pressed back!');
      this.modalGallerySliderService.closeModal();
      //  detecta  cuando se da click atras detecta y cierra la cualquiera modal activa
    });
    //  console.log( this.location.pushState(null, '', location.pathname))

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
      .then((result) => {})
      .catch((result) => {});
    /*    history.pushState(null, '', window.location.pathname); */
  }

  /* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
 myFunction(id:string) {
  document.getElementById(id)!.classList.toggle("show");
}

deleteResena(id:number){
  this.granjasService.deleteResena(id).subscribe(
    (response)=>{
      let index = this.resenas.findIndex(
        (resena)=>{
          return resena.id == id
        }
      );
      this.resenas.splice(index,1);
      this.miresena = null;
      console.log(response)
    },err=>{
      console.log(err)
    }
  )
}

updateMiResena(){
  this.loading = true;

}

shareFuntion(){
  this.location.onPopState(() => {
 this.appModalService.closeModalShare();
});
this.appModalService
 .shared(
   'Compartir detalles de la granja',
   '',
   `Echa un vistazo a la granja piscícola: ${this.granja.nombre}`,
   ''
 )
 .then((result) => {})
 .catch((result) => {});
}
}








