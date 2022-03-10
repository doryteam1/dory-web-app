import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RegExpUtils } from 'src/app/utilities/regexps';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  success:boolean = false;
  visiblePass:boolean = false;
  visibleMatchPass:boolean = false;
  
  form:FormGroup = new FormGroup({
    password:new FormControl('',[
      Validators.required,
      Validators.pattern(RegExpUtils.eigthChar()),
      Validators.pattern(RegExpUtils.capitalcase()),
      Validators.pattern(RegExpUtils.lowercase()),
      Validators.pattern(RegExpUtils.number()),
    ]),
    matchPassword:new FormControl('',Validators.required)
  });
  loading:boolean = false;
  token:string = '';

  constructor(private router:Router, private userService:UsuarioService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token')!;
    
    if(this.activatedRoute.snapshot.paramMap.keys.length>0){
      if(this.activatedRoute.snapshot.paramMap.get('token') == 'true')
      this.token = localStorage.getItem('token')!;
    }
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  onChange(){
    console.log('on change');
  }

  noMatchingPasswords(){
    return this.password?.value != this.matchPassword?.value && (this.matchPassword?.dirty || this.matchPassword?.touched);
  }

  onSubmit(){
    console.log('on change');
    if(this.form.invalid){
      return;
    }
    this.loading = true;
    let data:any = {
      newPassword: this.form.get('password')?.value,
      token:this.token
    }
    
    this.userService.updatePassword(data).subscribe(
      (response)=>{
        this.success = true;
      },err=>{
        console.log(err);
      }
    );
  }

  get password(){
    return this.form.get('password');
  }

  get matchPassword(){
    return this.form.get('matchPassword');
  }

  eigthChar(cad:string){
    return RegExpUtils.eigthCharTest(cad);
  }

  capitalcase(cad:string){
    return RegExpUtils.capitalcaseTest(cad);
  }

  lowercase(cad:string){
    return RegExpUtils.lowercaseTest(cad);
  }

  number(cad:string){
    return RegExpUtils.numberTest(cad);
  }
}
