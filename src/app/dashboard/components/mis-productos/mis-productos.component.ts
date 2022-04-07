import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-mis-productos',
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.scss']
})
export class MisProductosComponent implements OnInit {
  productos:Array<any> = [];
  showNotFound:boolean = false;
  constructor(private userService:UsuarioService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);

    this.userService.getProductosById(payload.sub).subscribe(
      (respose)=>{
        this.productos = respose.data;
        if(this.productos.length < 1){
          this.showNotFound = true;
        }
      },err=>{
        console.log(err)
      }
    )
  }

}
