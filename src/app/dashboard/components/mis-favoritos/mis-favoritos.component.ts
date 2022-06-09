import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.component.html',
  styleUrls: ['./mis-favoritos.component.scss']
})
export class MisFavoritosComponent implements OnInit {
misGranjaFavoritas:any[]=[]
  constructor(private granjasService:GranjasService, private router:Router, private appModalService:AppModalService) { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.granjasService.misFavoritas().subscribe(
      (response)=>{
        this.misGranjaFavoritas = response.data;
        console.log(this.misGranjaFavoritas)
      },err=>{

      }
    );
  }

  changeFavorite(i:number) {
    this.appModalService.confirm('Eliminar de favoritos','Esta seguro que desea quitar esta granja de mis favoritos','Eliminar','No estoy seguro')
    .then(
      (result)=>{
        if(result == true){
          this.misGranjaFavoritas[i].esfavorita = this.misGranjaFavoritas[i].esfavorita == 1 ? 0 : 1;
          this.granjasService
            .esFavorita(
              this.misGranjaFavoritas[i].id_granja
            )
            .subscribe(
              (response) => {
                this.misGranjaFavoritas.splice(i,1)
                console.log(response);
              },
              (err) => {
                console.log(err);
                this.misGranjaFavoritas[i].esfavorita = this.misGranjaFavoritas[i].esfavorita == 1 ? 0 : 1;
              }
            );
        }
      }
    ).catch(
      (result)=>{

      }
    )

  }

  navigate(i:number){
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/granjas/municipio/detalle/${this.misGranjaFavoritas[i].id_granja}`])
    );
    window.open(url, '_blank');
  }

  showResenas(idGranja:number){
    this.granjasService.showResenasModal('Reseñas','Cerrar',idGranja);
  }
}
