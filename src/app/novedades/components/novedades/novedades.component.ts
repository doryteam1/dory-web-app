import { Component, OnInit } from '@angular/core';
import { Novedad } from 'src/models/novedad.model';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {
  novedades:Array<Novedad> = [
    {
      nombre_autor: "Martin Lopez",
      url_foto_autor:"https://indiehoy.com/wp-content/uploads/2021/02/martin-lopez-lam-1200x900.jpg",
      url_foto_novedad:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa9uwDfvFQ_2PAL042vBjXYEbQdR1YDCT2zae-ytWTU6rGb71v6CAYgc5z-Nrh4E7HhtU&usqp=CAU",
      titular:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
      cuerpo:"Lorem Ipsum es simplemente texto de relleno de la industria de la impresión y la composición tipográfica. Lorem Ipsum ha sido el texto de relleno estándar de la industria desde la década de 1500, cuando un impresor desconocido tomó una galera de tipos y la mezcló...",
      fecha_creacion:"2021-05-06",
      visitas:3000,
      cant_likes:1000,
      categorias:["popular", "especies"]
    },
    {
      nombre_autor: "Martin Lopez",
      url_foto_autor:"https://indiehoy.com/wp-content/uploads/2021/02/martin-lopez-lam-1200x900.jpg",
      url_foto_novedad:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa9uwDfvFQ_2PAL042vBjXYEbQdR1YDCT2zae-ytWTU6rGb71v6CAYgc5z-Nrh4E7HhtU&usqp=CAU",
      titular:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
      cuerpo:"Lorem Ipsum es simplemente texto de relleno de la industria de la impresión y la composición tipográfica. Lorem Ipsum ha sido el texto de relleno estándar de la industria desde la década de 1500, cuando un impresor desconocido tomó una galera de tipos y la mezcló...",
      fecha_creacion:"2021-05-06",
      visitas:3000,
      cant_likes:1000,
      categorias:["popular", "especies"]
    },
    {
      nombre_autor: "Martin Lopez",
      url_foto_autor:"https://indiehoy.com/wp-content/uploads/2021/02/martin-lopez-lam-1200x900.jpg",
      url_foto_novedad:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa9uwDfvFQ_2PAL042vBjXYEbQdR1YDCT2zae-ytWTU6rGb71v6CAYgc5z-Nrh4E7HhtU&usqp=CAU",
      titular:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
      cuerpo:"Lorem Ipsum es simplemente texto de relleno de la industria de la impresión y la composición tipográfica. Lorem Ipsum ha sido el texto de relleno estándar de la industria desde la década de 1500, cuando un impresor desconocido tomó una galera de tipos y la mezcló...",
      fecha_creacion:"2021-05-06",
      visitas:3000,
      cant_likes:1000,
      categorias:["popular", "especies"]
    },
    {
      nombre_autor: "Martin Lopez",
      url_foto_autor:"https://indiehoy.com/wp-content/uploads/2021/02/martin-lopez-lam-1200x900.jpg",
      url_foto_novedad:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa9uwDfvFQ_2PAL042vBjXYEbQdR1YDCT2zae-ytWTU6rGb71v6CAYgc5z-Nrh4E7HhtU&usqp=CAU",
      titular:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
      cuerpo:"Lorem Ipsum es simplemente texto de relleno de la industria de la impresión y la composición tipográfica. Lorem Ipsum ha sido el texto de relleno estándar de la industria desde la década de 1500, cuando un impresor desconocido tomó una galera de tipos y la mezcló...",
      fecha_creacion:"2021-05-06",
      visitas:3000,
      cant_likes:1000,
      categorias:["popular", "especies"]
    },
    {
      nombre_autor: "Martin Lopez",
      url_foto_autor:"https://indiehoy.com/wp-content/uploads/2021/02/martin-lopez-lam-1200x900.jpg",
      url_foto_novedad:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa9uwDfvFQ_2PAL042vBjXYEbQdR1YDCT2zae-ytWTU6rGb71v6CAYgc5z-Nrh4E7HhtU&usqp=CAU",
      titular:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
      cuerpo:"Lorem Ipsum es simplemente texto de relleno de la industria de la impresión y la composición tipográfica. Lorem Ipsum ha sido el texto de relleno estándar de la industria desde la década de 1500, cuando un impresor desconocido tomó una galera de tipos y la mezcló...",
      fecha_creacion:"2021-05-06",
      visitas:3000,
      cant_likes:1000,
      categorias:["popular", "especies"]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
