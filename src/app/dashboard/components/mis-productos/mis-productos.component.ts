import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-mis-productos',
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.scss']
})
export class MisProductosComponent implements OnInit {
  productos:Array<any> = [];
  showNotFound:boolean = false;
  form:FormGroup = new FormGroup({
    nombreProducto:new FormControl('',[Validators.required]),
    descripcion:new FormControl('',[Validators.required]),
    imagen:new FormControl('',[Validators.required]),
    precio:new FormControl(0,[Validators.required]),
  });
  constructor(private proveedorService:ProveedorService, private modalService:NgbModal) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);

    this.proveedorService.getProductosById(payload.sub).subscribe(
      (respose)=>{
        this.productos = respose.data;
        if(this.productos.length < 1){
          this.showNotFound = true;
        }
        console.log(this.productos)
      },err=>{
        console.log(err)
      }
    )
  }

  openModal(content:any){
    this.modalService.open(content).result.then(
      (result)=>console.log(result)
    )
  }

  addProducto(){
    console.log("addProducto")
    if(!this.form.valid){
      return;
    }

    this.proveedorService.addProducto(this.form.value).subscribe(
      (response)=>{
        console.log(response)
      }
    )
  }

}
