import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.component.html',
  styleUrls: ['./mis-favoritos.component.scss']
})
export class MisFavoritosComponent implements OnInit {
miGranjaFavorita:any[]=[]
  constructor() { }

  ngOnInit(): void {
    this.miGranjaFavorita=[
      {
        img:"../../../../assets/images/foto hotel.jpg",
        titulo: "Granja 1",
        calificacion:1258,
        ubicacion:"Galeras Sucre"
      },
      {
        img:"../../../../assets/images/foto hotel.jpg",
        titulo: "Granja 2",
        calificacion:2259,
        ubicacion:"Sucre Sucre"
      },
      {
        img:"../../../../assets/images/foto hotel.jpg",
        titulo: "Granja 3",
        calificacion:122888,
        ubicacion:"Sincelejo Sucre"
      },
      {
        img:"../../../../assets/images/foto hotel.jpg",
        titulo: "Granja 4",
        calificacion:1254488,
        ubicacion:"Corozal Sucre"
      }
    ]
  }

}
