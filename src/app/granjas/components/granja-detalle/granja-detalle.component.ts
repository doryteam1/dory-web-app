import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GranjasService } from '../../services/granjas.service';

@Component({
  selector: 'app-granja-detalle',
  templateUrl: './granja-detalle.component.html',
  styleUrls: ['./granja-detalle.component.scss']
})
export class GranjaDetalleComponent implements OnInit {
  granja:any;
  showNotFound:boolean = false;
  showError:boolean = false;
  selectedGranjaId:number = -1;
  errorMessage = '';
  showGallery:boolean = false;
  
  constructor(private granjasService:GranjasService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedGranjaId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.granjasService.getGranjaDetalle(this.selectedGranjaId).subscribe(
      (response)=>{
        if(response.data.length > 0){
          this.granja = response.data[0];
          this.showError = false;
          this.showNotFound = false;
        }else{
          this.showNotFound = true;
          this.showError = false;
        }
      },err=>{
        this.showNotFound = false;
        this.showError = false;
        if(err.status == 404){
          this.showNotFound = true;
        }else{
          this.showError = true;
          this.errorMessage = 'Error inesperado';
        }
      }
    );
  }

}
