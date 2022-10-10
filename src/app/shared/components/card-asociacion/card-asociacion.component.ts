import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-card-asociacion',
  templateUrl: './card-asociacion.component.html',
  styleUrls: ['./card-asociacion.component.scss'],
})
export class CardAsociacionComponent implements OnInit, OnDestroy {
  @Input() asociacion: any;
  @Input() delatecard!: boolean;
  @Input() showRepLegal: boolean = true;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onDetalleRepresentante: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorasociaciones: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  foto_camaracpdf!: string;
  shorterNumber: number = 15;
  urls:any[] = [];
  loadedUrls:boolean = false;

  constructor(public mediaQueryService: MediaQueryService, private asociacionesService:AsociacionesService, private utilitiesService:UtilitiesService, private firebaseStorageService:FirebaseStorageService) {}
  cardAsociaMediaQuery1!: Subscription;

  ngOnInit(): void {
    this.cardAsociaMediaQuery1 = this.mediaQueryService
      .mediaQuery('max-width: 382px')
      .subscribe((matches) => {
        if (matches) {
          this.shorterNumber = 10;
        } else {
          this.shorterNumber = 15;
        }
      });
  }


  download(){
    try{
      this.asociacionesService.getMiembrosPrivado(this.asociacion.nit).subscribe(
        async (response)=>{
          let representante = response.data.representante;
          let miembros = response.data.miembros;
          if(representante){
            if(representante.url_imagen_cedula){
              let cedulaBase64 = await this.utilitiesService.urlToBase64(representante.url_imagen_cedula)
              let metaCedula = await this.firebaseStorageService.refFromUrl(representante.url_imagen_cedula).getMetadata().toPromise();
              this.urls.push({
                data:'cedulas/cedula-rep-'+representante.nombres.replace(/\s+/g, '')+'.'+metaCedula.name.split('.')[1],
                url:representante.url_imagen_cedula,
                image:cedulaBase64
              })  
            }
            
            if(representante.url_sisben){
              let sisbenBase64 = await this.utilitiesService.urlToBase64(representante.url_sisben)
              let metaSisben = await this.firebaseStorageService.refFromUrl(representante.url_sisben).getMetadata().toPromise();
              this.urls.push({
                data:'sisben/sisben-rep-'+representante.nombres.replace(/\s+/g, '')+'.'+metaSisben.name.split('.')[1],
                url:representante.url_sisben,
                image:sisbenBase64
              })
            }
          }
          if(miembros){
            for(let i=0; i<miembros.length; i++){
              if(miembros[i].url_imagen_cedula){
                let cedulaBase64 = await this.utilitiesService.urlToBase64(miembros[i].url_imagen_cedula)
                let metaCedula = await this.firebaseStorageService.refFromUrl(miembros[i].url_imagen_cedula).getMetadata().toPromise();
                this.urls.push({
                  data:'cedulas/cedula-'+miembros[i].nombres.replace(/\s+/g, '')+'.'+metaCedula.name.split('.')[1],
                  url:miembros[i].url_imagen_cedula,
                  image:cedulaBase64
                });
  
              }
              if(miembros[i].url_sisben){
                let sisbenBase64 = await this.utilitiesService.urlToBase64(miembros[i].url_sisben)
                let metaSisben = await this.firebaseStorageService.refFromUrl(miembros[i].url_sisben).getMetadata().toPromise();
                this.urls.push({
                  data:'sisben/sisben-'+miembros[i].nombres.replace(/\s+/g, '')+'.'+metaSisben.name.split('.')[1],
                  url:miembros[i].url_sisben,
                  image:sisbenBase64
                });
              }
            }
          }
          this.utilitiesService.compressFileToZip(this.urls);
        }
      )
    }catch(err){
      console.log(err)
    }
  }

  ngOnDestroy(): void {
    this.cardAsociaMediaQuery1.unsubscribe();
  }
  detalle(asociacion: any) {
    console.log(asociacion);
    return this.onDetalle.emit(asociacion);
  }

  eliminar(asociacion: any) {
    return this.onDelete.emit(asociacion);
  }
  goDetalleRepresentante(asociacion: any) {
    console.log(asociacion);
    return this.onDetalleRepresentante.emit(asociacion);
  }
}
