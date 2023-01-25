import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-card-publicacion',
  templateUrl: './card-publicacion.component.html',
  styleUrls: ['./card-publicacion.component.scss'],
})
export class CardPublicacionComponent implements OnInit {
  @Input() publicacion: any;
  @Input() index!: number;
  @Input() editaAndEliminar: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onUpdatePublicacion: EventEmitter<any> = new EventEmitter();
  @Output() onDeletePublicacion: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {

    registerLocaleData(es);
  }

  goDetail() {
    this.onDetalle.emit();
  }
  updatePublicacion() {
    this.onUpdatePublicacion.emit();
  }
  deletePublicacion() {
    this.onDeletePublicacion.emit();
  }
}
