import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GranjasService } from '../../services/granjas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-granja-detalle',
  templateUrl: './granja-detalle.component.html',
  styleUrls: ['./granja-detalle.component.scss']
})
export class GranjaDetalleComponent implements OnInit {
  granja:any;
  fotosgranja:any;
  showNotFound:boolean = false;
  showError:boolean = false;
  selectedGranjaId:number = -1;
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
  constructor(private granjasService:GranjasService, private activatedRoute:ActivatedRoute,private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.selectedGranjaId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.granjasService.getGranjaDetalle(this.selectedGranjaId).subscribe(
      (response)=>{
        if(response.data.length > 0){
          this.granja = response.data[0];
          this.fotosgranja=response.data[0].fotos
          console.log(this.fotosgranja)
          console.log(this.granja)
          this.showError = false;
          this.showNotFound = false;
        }else{
          this.showNotFound = true;
          this.showError = false;
        }
      },err=>{
        this.showNotFound = false;
        this.showError = false;
        if(err.status == 404){
          this.showNotFound = true;
        }else{
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
 
 fotoSele(i:number,content:any){
    this.indice=i
    this.openGaleriaModal(content)
    console.log(content)
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
  openGaleriaModal(content:any){
    this.showconte=false
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass:'modal-photo' , scrollable: true,centered: true}).result.then((result) => {
    console.log(result)
    }, (reason) => {
      console.log(reason)
    });
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
}
