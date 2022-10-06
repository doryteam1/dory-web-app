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
  loading:boolean = false;
  showNotFound:boolean = false;
  showError:boolean = false;
  constructor(private router:Router, private publicacionService:PublicacionesService, private userService:UsuarioService) { }

  ngOnInit(): void {
    this.loading = true;
    this.authUser = this.userService.getAuthUser()
    this.publicacionService.getPublicacionesByUser(this.authUser.sub).subscribe(
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

  create() {
    let object = {
      action: 'create',
      formState: 'enable',
    };
    this.router.navigate(['/dashboard/publicacion/detalle', object]);
  }

  navigate(event: any, state: string) {
    console.log(event)
    let object: any = { ...event };
    object.action = 'update'
    object.formState = state;
    this.router.navigate(['/dashboard/publicacion/detalle', object]);
  }
  deletePublicacion(){
    
  }
}
