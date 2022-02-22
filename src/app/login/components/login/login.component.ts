import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MailService } from 'src/app/services/mail.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form:FormGroup = new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email]),
    password:new FormControl('',[Validators.required]),
  });
  loading:boolean = false;

  constructor(private router:Router,private mailService:MailService, private userService:UsuarioService) { }

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
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }
    
    this.userService.login(data).subscribe(
      (response)=>{
        localStorage.setItem('email',data.email);
        localStorage.setItem('token',response.body.token);
        this.loading = false;
        this.router.navigateByUrl('/dashboard');    
      },err=>{
        this.loading = false;
        console.log(err);
      }
    );
  }

  get email(){
    return this.form.get('email');
  }

  get password(){
    return this.form.get('password');
  }


}
