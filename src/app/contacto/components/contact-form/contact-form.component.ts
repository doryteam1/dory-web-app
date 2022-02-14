import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  form:FormGroup = new FormGroup({
    nomCompleto:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required, Validators.email]),
    celular:new FormControl('',[Validators.required]),
    asunto:new FormControl('',[Validators.required],),
    mensaje:new FormControl('',[Validators.required]),
  });
  loading:boolean = false;

  constructor(private router:Router) { }

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
    this.router.navigateByUrl('/basic-message');

    console.log(this.form.value)
    
    this.loading = true;
  }


  get nomCompleto(){
    return this.form.get('nomCompleto')
  }

  get email(){
    return this.form.get('email');
  }

  get celular(){
    return this.form.get('celular');
  }

  get asunto(){
    return this.form.get('asunto');
  }

  get mensaje(){
    return this.form.get('mensaje');
  }


}
