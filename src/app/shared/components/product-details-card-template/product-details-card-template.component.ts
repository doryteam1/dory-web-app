import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductDetailsCardTemplate } from 'src/models/productDetailsCardTemplate.model';

@Component({
  selector: 'app-product-details-card-template',
  templateUrl: './product-details-card-template.component.html',
  styleUrls: ['./product-details-card-template.component.scss'],
})
export class ProductDetailsCardTemplateComponent implements OnInit {
  @Input() datos: ProductDetailsCardTemplate = {};
  @Input() contentLoaded: boolean = false;
  @Input() productoDetalles: boolean = false;
  @Input() publicacioneDetalles: boolean = false;
  @Input() vehiculoDetalles: boolean = false;
  @Input() negocioDetalles: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onOpenChat: EventEmitter<any> = new EventEmitter();
  authUserId: boolean = false;
  showLess: boolean = true;

  itemsNegocio: any[] = [
    { title: 'Nombre' },
    { title: 'Municipio' },
    { title: 'Departamento' },
    { title: 'Direcció' },
  ];

  itemsProducto: any[] = [{ title: 'Nombre' }, { title: 'Precio (COP)' }];

  itemsPublicacione: any[] = [
    { title: 'Especie' },
    { title: 'Precio(COP)' },
    { title: 'Cantidad(Kg)' },
    { title: 'Fecha de publicación' },
  ];

  itemsVehiculo: any[] = [
    { title: 'Modelo' },
    { title: 'Capacidad' },
    { title: 'Transporta Alimento' },
  ];
  skeletonLoaderStyle: any[] = [
    {
      width: '200px',
      'border-radius': '5px',
      height: '24px',
      'margin-bottom': '0',
    },
    {
      width: '100px',
      'border-radius': '5px',
      height: '24px',
      'margin-bottom': '0',
    },
    {
      width: '150px',
      'border-radius': '5px',
      height: '24px',
      'margin-bottom': '0',
    },
    {
      width: '100%',
      'border-radius': '5px',
      height: '100px',
      'margin-bottom': '0',
    },
    {
      width: '100%',
      'border-radius': '5px',
      height: '80vh',
      'margin-bottom': '0',
      'max-height': '350px',
    },
  ];


  ngOnInit(): void {
  }
  goDetail() {
    this.onDetalle.emit('detalles');
  }
  sendMessage() {
    this.onOpenChat.emit('openChat');
  }
  toggleContent() {
    this.showLess = !this.showLess;
  }
}
