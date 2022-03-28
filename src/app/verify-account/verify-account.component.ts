import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {
  error:string = '';
  verificado:boolean = false;
  constructor(private activatedRoute:ActivatedRoute, private userService:UsuarioService) { }

  ngOnInit(): void {
    let token:string = this.activatedRoute.snapshot.queryParamMap.get('token')!;
    console.log(this.activatedRoute.snapshot.queryParamMap)

  }

  verify(){
    console.log("verify account...")
    let token:string = this.activatedRoute.snapshot.queryParamMap.get('token')!;
    console.log(token)
    this.userService.verifyAccount(token).subscribe(
      (response)=>{
        this.verificado = true;
      },err=>{
        if(err.status == '404'){
          this.error = 'Usuario no existe';
        }else{
          this.error="Error inesperado";
        }
      }
    )
  }

}
