import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,

} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AreasExperticiaService } from 'src/app/services/areas-experticia.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TopAlertControllerService } from 'src/app/shared/services/top-alert-controller.service';
import { Utilities } from 'src/app/utilities/utilities';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { vertices } from '../../../global/constants';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import imageCompression from 'browser-image-compression';
import { ProveedorService } from 'src/app/services/proveedor.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  productos:Array<any> = [];
  productosFiltered:Array<any> = [];
  constructor(private proveedorService:ProveedorService){

  }
  ngOnInit(): void {
    registerLocaleData(es);
    this.proveedorService.getProductosAll().subscribe(
      (response)=>{
        console.log(response);
        this.productos = response.data;
        this.productosFiltered = this.productos;
      }
    )
  }

  onSearch(text:string){
      console.log("productos ",text)
      if(text == ''){
        this.productosFiltered = this.productos;
      }else{
        this.productosFiltered = this.productos.filter((element)=>{
          return element.nombreProducto.toLocaleLowerCase().includes(text.toLocaleLowerCase());
        })
      }
  }
}
