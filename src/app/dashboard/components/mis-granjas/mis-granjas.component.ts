import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { ConfirmModalService } from 'src/app/shared/services/confirm-modal.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-mis-granjas',
  templateUrl: './mis-granjas.component.html',
  styleUrls: ['./mis-granjas.component.scss']
})
export class MisGranjasComponent implements OnInit {
  granjas:Array<any> = [];
  showNotFound:boolean = false;
  form:FormGroup = new FormGroup({
    nombre_granja:new FormControl('',[Validators.required]),
    area:new FormControl(0,[Validators.required]),
    numero_trabajadores:new FormControl(0,[Validators.required]),
    produccion_estimada_mes:new FormControl(0,[Validators.required]),
    direccion:new FormControl('',[Validators.required]),
    latitud:new FormControl(0,[Validators.required]),
    longitud:new FormControl(0,[Validators.required]),
    descripcion:new FormControl('',[Validators.required]),
    id_departamento:new FormControl(70,[Validators.required]),
    id_municipio:new FormControl('',[Validators.required]),
    id_vereda:new FormControl(0),
    id_corregimiento:new FormControl(0),
    corregimiento:new FormControl('',[Validators.required]),
    vereda:new FormControl('',[Validators.required]),
    arrayTiposInfraestructuras:new FormControl(null),
    arrayEspecies:new FormControl(null),
  });
  file:any = null;
  productImagePath: string = '';
  itemUpdateIndex:number = -1;
  modalMode:string = 'create';
  municipios:Array<any> = [];
  departamentos:Array<any> = [];
  loading:boolean = false;
  constructor(private granjaService:GranjasService, private modalService:NgbModal, private storage:FirebaseStorageService, private sanitizer: DomSanitizer, private places:PlacesService, private confirmModalService:ConfirmModalService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);

    this.granjaService.getGranjaByUserId(payload.sub).subscribe(
      (respose)=>{
        this.granjas = respose.data;
        if(this.granjas.length < 1){
          this.showNotFound = true;
        }
      },err=>{
        console.log(err)
      }
    )

    this.loadDptos();
  }

  initForm(){
    this.nombreGranja?.setValue('');
    this.area?.setValue(0)
    this.numeroTrabajadores?.setValue(0);
    this.prodEstimadaMes?.setValue(0);
    this.direccion?.setValue(0);
    this.latitud?.setValue(0);
    this.longitud?.setValue(0);
    this.descripcion?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
    this.idVereda?.setValue(0);
    this.idCorregimiento?.setValue(0);
    this.corregimiento?.setValue('')
    this.vereda?.setValue('');
  }

  openModal(content:any, action:string, i?:number){
    this.modalMode = action;
    this.form.reset()
    this.initForm();
    this.idDpto?.setValue(70);
    if(action == 'update'){
      this.nombreGranja?.setValue(this.granjas[i!].nombre);
      this.descripcion?.setValue(this.granjas[i!].descripcion);
      this.area?.setValue(this.granjas[i!].area);
      this.numeroTrabajadores?.setValue(this.granjas[i!].numero_trabajadores);
      this.prodEstimadaMes?.setValue(this.granjas[i!].produccion_estimada_mes);
      this.direccion?.setValue(this.granjas[i!].direccion);
      this.idDpto?.setValue(this.granjas[i!].id_departamento);
      this.idMunic?.setValue(this.granjas[i!].id_municipio);
      this.latitud?.setValue(this.granjas[i!].latitud);
      this.longitud?.setValue(this.granjas[i!].longitud);
      this.idDpto?.setValue(this.granjas[i!].id_departamento);
      this.idMunic?.setValue(this.granjas[i!].id_municipio);
      this.idCorregimiento?.setValue(this.granjas[i!].id_corregimiento);
      this.idVereda?.setValue(this.granjas[i!].id_vereda);
      this.itemUpdateIndex = i!;
    }
    this.modalService.open(content).result.then(
      (result)=>{
        console.log("se cerro modal ",result)
      } 
    ).catch(
      (err)=>{
        this.file = null;
        this.productImagePath = '';
        console.log(err)
      }
    )
  }

  addGranja(){
    console.log("addGranja")
    console.log(this.form.value)
    console.log(this.form.controls)
    this.loading = true;
    if(!this.form.valid){
      console.log("Not valid!")
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }

    this.granjaService.addGranja(this.form.getRawValue()).subscribe(
      (response)=>{
        this.loading = false;
        this.modalService.dismissAll();
        window.location.reload();
        console.log(response)
      },err=>{
        this.loading = false;
        console.log(err)
      }
    )
    
  }

  fileChange(event:any){
    console.log("change",event)
    this.file = event.target.files[0];
    /* let productImagePath:any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]))
    console.log(productImagePath.changingThisBreaksApplicationSecurity) */
    //this.productImagePath = productImagePath.changingThisBreaksApplicationSecurity;
  }

  anularGranja(idGranja:number, i:number){
    this.confirmModalService.confirm('Eliminar granja','Esta seguro que desea eliminar la granja con id','Eliminar','No estoy seguro',JSON.stringify(idGranja))
    .then(
      (result)=>{
        if(result == true){
          this.granjaService.anularGranja(idGranja).subscribe(
            (response:any)=>{
              this.granjas.splice(i,1);
            },err=>{
              console.log(err)
            }
          )
          }
        }
    ).catch(
      (result)=>{
        
      }
    )
  }

  updateGranja(){
    this.loading = true;
    if(!this.form.valid){
      console.log("Not valid!")
      this.form.markAllAsTouched()
      this.loading = false;
      return;
    }
   
    this.granjaService.updateGranja(this.granjas[this.itemUpdateIndex].id_granja,this.form.getRawValue()).subscribe(
      (response)=>{
        console.log(response)
        this.loading = false;
        window.location.reload();
        this.modalService.dismissAll()
      },err=>{
        console.log(err)
        this.loading = false;
      }
    );
    //this.proveedorService.updateProducto(this.form)
  }

  loadDptos(){
    this.places.getDepartamentos().subscribe(
      (response)=>{
        this.departamentos = response.data;
        console.log(this.departamentos)
        this.idDpto?.setValue(70);
        this.idDpto?.disable();
        this.loadMunic();
      },err=>{
        console.log(err);
      }
    );
  }

  loadMunic(){
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response)=>{
        this.municipios = response.data;
      },(err)=>{
        console.log(err);
      }
    );
  }

  changeDpto(){
    this.form.get('id_municipio')?.setValue(0);
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response)=>{
        this.municipios = response.data;
      },(err)=>{
        console.log(err);
      }
    );
  }


  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  get idDpto(){
    return this.form.get('id_departamento');
  }
        
  get idMunic(){
    return this.form.get('id_municipio');
  }

  get nombreGranja(){
    return this.form.get('nombre_granja')
  }

  get descripcion(){
    return this.form.get('descripcion')
  }

  get area(){
    return this.form.get('area')
  }

  get numeroTrabajadores(){
    return this.form.get('numero_trabajadores')   
  }

  get prodEstimadaMes(){
    return this.form.get('produccion_estimada_mes')
  }

  get direccion(){
    return this.form.get('direccion')
  }

  get corregimiento(){
    return this.form.get('corregimiento');
  }

  get vereda(){
    return this.form.get('vereda');
  }

  get latitud(){
    return this.form.get('latitud');
  }

  get longitud(){
    return this.form.get('longitud');
  }

  get idVereda(){
    return this.form.get('id_vereda');
  }

  get idCorregimiento(){
    return this.form.get('id_corregimiento');
  }
}
