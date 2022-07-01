import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-card-asociacion',
  templateUrl: './card-asociacion.component.html',
  styleUrls: ['./card-asociacion.component.scss']
})
export class CardAsociacionComponent implements OnInit {
  @Input() asociacion: any;
  @Output() onDetalle:EventEmitter<any> = new EventEmitter(); 
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorasociaciones: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  foto_camaracpdf!: string;
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
  }
  navigate(id: number) {
    this.router.navigateByUrl('/asociaciones/municipio/detalle/' + this.asociacion.nit);
  }
  
  detalle(asociacion:any){
    return this.onDetalle.emit(asociacion);
  }
}
