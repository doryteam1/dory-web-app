import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  success:boolean = false;
  form:FormGroup = new FormGroup({
    password:new FormControl('',[Validators.required]),
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
    let data:any = {
      password: this.form.get('password')?.value
    }
    
    this.success = true;
  }

  get password(){
    return this.form.get('password');
  }
}
