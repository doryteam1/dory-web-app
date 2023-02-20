import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-filter-forum',
  templateUrl: './user-filter-forum.component.html',
  styleUrls: ['./user-filter-forum.component.scss'],
})
export class UserFilterForumComponent implements OnInit {
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() tipoFiltro: number = 0;
  @Input() count:any;
  @Input() filtros:any[]=[]


  constructor() {}

  ngOnInit(): void {}

  filter(tipo: number, nombre: string, idx: number) {
    this.tipoFiltro = idx;
    this.onFilter.emit({ tipo: tipo, nombre: nombre });
  }
}
