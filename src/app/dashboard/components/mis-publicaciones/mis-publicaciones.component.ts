import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.component.html',
  styleUrls: ['./mis-publicaciones.component.scss']
})
export class MisPublicacionesComponent implements OnInit {
  publicaciones:any[]=[];
  private authUser:any;
  constructor(private router:Router, private publicacionService:PublicacionesService, private userService:UsuarioService) { }

  ngOnInit(): void {
    this.authUser = this.userService.getAuthUser()
    this.publicacionService.getPublicacionesByUser(this.authUser.sub).subscribe(
      (response)=>{
        this.publicaciones = response.data;
      }
    )
  }
}
