import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GranjasService } from 'src/app/granjas/services/granjas.service';

@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.component.html',
  styleUrls: ['./mis-favoritos.component.scss']
})
export class MisFavoritosComponent implements OnInit {
misGranjaFavoritas:any[]=[]
  constructor(private granjasService:GranjasService, private router:Router) { }

  ngOnInit(): void {
    this.granjasService.misFavoritas().subscribe(
      (response)=>{
        this.misGranjaFavoritas = response.data;
      },err=>{

      }
    );
  }

  changeFavorite(i:number) {
    this.misGranjaFavoritas[i].esfavorita = this.misGranjaFavoritas[i].esfavorita == 1 ? 0 : 1;  
    this.granjasService
      .esFavorita(
        this.misGranjaFavoritas[i].id_granja
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (err) => {
          console.log(err);
          this.misGranjaFavoritas[i].esfavorita = this.misGranjaFavoritas[i].esfavorita == 1 ? 0 : 1;
        }
      );
  }

  showDetail(i:number){
    // Converts the route into a string that can be used 
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/granjas/municipio/detalle/${this.misGranjaFavoritas[i].id_granja}`])
    );
    window.open(url, '_blank');
  }
}
