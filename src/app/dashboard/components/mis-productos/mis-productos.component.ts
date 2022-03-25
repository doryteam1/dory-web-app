import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mis-productos',
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.scss']
})
export class MisProductosComponent implements OnInit {
  productos:Array<any> = [];

  constructor(private userService:UsuarioService) { }

  ngOnInit(): void {
    this.userService.getProductosById(1).subscribe(
      (respose)=>{
        this.productos = respose.data;
      },err=>{
        console.log(err)
      }
    )
  }

}
