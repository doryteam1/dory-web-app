
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss']
})
export class PublicacionesComponent implements OnInit {
  publicaciones:any[]=[];
  private authUser:any;
  loading:boolean = false;
  showNotFound:boolean = false;
  showError:boolean = false;
  constructor(private router:Router, private publicacionService:PublicacionesService, private userService:UsuarioService) { }

  ngOnInit(): void {
    this.loading = true;
    this.authUser = this.userService.getAuthUser()
    this.publicacionService.getPublicacionesTodas().subscribe(
      (response)=>{
        this.publicaciones = response.data;
        this.loading = false;
        if(this.publicaciones.length < 1){
          this.showNotFound = true;
        }else{
          this.showNotFound = false;
        }
      },err=>{
        console.log(err)
        this.showNotFound = false;
        this.showError = true;
        this.loading = false;

      }
    )
  }
  navigate(event: any, state: string) {
    let object: any = { ...event };
    object.action = 'update'
    object.actionDos = 'soloVer'
    object.formState = state;
       let url = this.router.serializeUrl(
         this.router.createUrlTree(['/dashboard/publicacion/detalle', object])
       );
       window.open(url, '_blank');
  }
}
