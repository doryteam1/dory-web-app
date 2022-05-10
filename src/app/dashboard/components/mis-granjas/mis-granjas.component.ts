import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
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
    corregimiento_vereda:new FormControl(''),
    arrayTiposInfraestructuras:new FormArray([]),
    arrayEspecies:new FormArray([]),
  });
  file:any = null;
  productImagePath: string = '';
  itemUpdateIndex:number = -1;
  modalMode:string = 'create';
  municipios:Array<any> = [];
  departamentos:Array<any> = [];
  loading:boolean = false;
  infraestructurasData:Array<any> = [];
  especiesData:Array<any> = [];

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

    this.granjaService.getInfraestructuras().subscribe(
      (response)=>{
        this.infraestructurasData = response.data;
      },err=>{
        console.log(err)
      }
    )

    this.granjaService.getEspecies().subscribe(
      (response)=>{
        this.especiesData = response.data;
      },err=>{
        console.log(err)
      }
    )
  }

  initForm(){
    this.nombreGranja?.setValue('');
    this.area?.setValue(0)
    this.numeroTrabajadores?.setValue(0);
    this.prodEstimadaMes?.setValue(0);
    this.direccion?.setValue('');
    this.latitud?.setValue(0);
    this.longitud?.setValue(0);
    this.descripcion?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
    this.idVereda?.setValue(0);
    this.idCorregimiento?.setValue(0);
    this.corregimiento_vereda?.setValue('')
    this.infraestructuras.clear();
    this.especies.clear();
  }

  openModal(content:any, action:string, i?:number){
    this.modalMode = action;
    this.form.reset()
    this.initForm();
    this.idDpto?.setValue(70);
    if(action == 'update'){
      this.granjaService.getGranjaDetalle(this.granjas[i!].id_granja).subscribe(
        (granja)=>{
          let granjaDetalle = granja.data[0];
          console.log(granjaDetalle)
          this.nombreGranja?.setValue(granjaDetalle.nombre);
          this.descripcion?.setValue(granjaDetalle.descripcion);
          this.area?.setValue(granjaDetalle.area);
          this.numeroTrabajadores?.setValue(granjaDetalle.numero_trabajadores);
          this.prodEstimadaMes?.setValue(granjaDetalle.produccion_estimada_mes);
          this.direccion?.setValue(granjaDetalle.direccion);
          this.idDpto?.setValue(granjaDetalle.id_departamento);
          this.idMunic?.setValue(granjaDetalle.id_municipio);
          this.latitud?.setValue(granjaDetalle.latitud);
          this.longitud?.setValue(granjaDetalle.longitud);
          this.idDpto?.setValue(granjaDetalle.id_departamento);
          this.idMunic?.setValue(granjaDetalle.id_municipio);
          this.idCorregimiento?.setValue(granjaDetalle.id_corregimiento);
          this.idVereda?.setValue(granjaDetalle.id_vereda);
          this.corregimiento_vereda?.setValue(granjaDetalle.corregimiento_vereda);
      
          if(granjaDetalle.infraestructuras && granjaDetalle.infraestructuras.length > 0){
            granjaDetalle.infraestructuras.forEach((element:any) => {
              this.infraestructuras?.push(new FormControl(element.id_infraestructura))
            });
          }
        
          if(granjaDetalle.especies && granjaDetalle.especies.length > 0){
            granjaDetalle.especies.forEach((element:any) => {
              this.especies?.push(new FormControl(element.id_especie))
            });
          }
        }
      )
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

  deleteGranja(idGranja:number, i:number){
    this.confirmModalService.confirm('Eliminar granja','Esta seguro que desea eliminar la granja','Eliminar','No estoy seguro',this.granjas[i].nombre)
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
    console.log(this.form.getRawValue())
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

  onCheckboxChange(e:any,controlName:string) {
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: AbstractControl,i:number,controls:Array<AbstractControl>) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  isChecked(controlName:string, value:number){
    let checked:boolean =false
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    checkArray.controls.forEach((item: AbstractControl,i:number,controls:Array<AbstractControl>) => {
      if (item.value == value) { 
        checked =  true;
      }
    });
    return checked;
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

  get corregimiento_vereda(){
    return this.form.get('corregimiento_vereda');
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

  get infraestructuras(){
    return this.form.get('arrayTiposInfraestructuras') as FormArray;
  }

  get especies(){
    return this.form.get('arrayEspecies') as FormArray;
  }
}
