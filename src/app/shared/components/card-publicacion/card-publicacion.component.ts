import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-card-publicacion',
  templateUrl: './card-publicacion.component.html',
  styleUrls: ['./card-publicacion.component.scss']
})
export class CardPublicacionComponent implements OnInit {
  @Input() publicacion:any;
  @Input() index!:number;
  @Output() onDetail:EventEmitter<any> = new EventEmitter();
  constructor(private router:Router) { }

  ngOnInit(): void {
    registerLocaleData( es );
  }

  goDetail(publicacion: any) {
    this.onDetail.emit(publicacion);
  }
}
