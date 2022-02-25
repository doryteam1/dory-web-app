import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  send:boolean = false;
  form:FormGroup = new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email]),
  });
  loading:boolean = false;

  constructor(private router:Router, private userService:UsuarioService) { }

  ngOnInit(): void {
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  onChange(){
    console.log('on change');
  }

  onSubmit(){
    console.log('on change');
    if(this.form.invalid){
      return;
    }
    this.loading = true;

    this.userService.recoveryPassword(this.form.get('email')?.value).subscribe(
      (respose)=>{
        this.send = true;
      },err=>{
        console.log(err);
      }
    )
    
  }

  get email(){
    return this.form.get('email');
  }

  get password(){
    return this.form.get('password');
  }


}
