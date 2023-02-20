import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('txtBuscar') txtBuscar!: any;
  @Input() buscadorpersonalizado: boolean = false;
  @Input() placeholderbuscador!: string;
  @Input() activeClase: boolean = false;
  @Input() activeClasetwo: boolean = false;
  @Input() activeClaseForo: boolean = false;

  @Input() set valorInput(value: boolean) {
   if (this.txtBuscar?.nativeElement) {
     this.txtBuscar.nativeElement.value = '';
   } else {
     return;
   }

  }
  sinresultados: boolean = false;

  @Output() textSearch: EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPress: EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPressData: EventEmitter<string> = new EventEmitter();
  text: string = '';
  constructor() {}
  ngOnInit(): void {}
  onChange() {
    this.textSearch.emit(this.text);
  }

  onEnterPress() {
    this.keyEnterPress.emit(this.text);
  }

  /* andres codigo */
  search() {
    const valor = this.txtBuscar.nativeElement.value;
    this.keyEnterPressData.emit(valor.toLowerCase());
  }
}
