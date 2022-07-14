import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { SearchBuscadorService } from '../../services/search-buscador.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;
  @Input() buscadorpersonalizado: boolean = false;
  @Input() placeholderbuscador!: string;
  @Input() dataabuscar!: string;
  @Output() textSearch: EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPress: EventEmitter<string> = new EventEmitter();
  text: string = '';
  constructor(private searchBuscadorService: SearchBuscadorService) {}
  onChange() {
    this.textSearch.emit(this.text);
  }

  onEnterPress() {
    console.log('press enter');
    this.keyEnterPress.emit(this.text);
    console.log(this.text);
  }
  search() {
    const valor = this.txtBuscar.nativeElement.value;
    if (valor.trim().length === 0) {
      return;
    }
    this.searchBuscadorService.buscarData(valor,this.dataabuscar)
     this.keyEnterPress.emit();
   /*  this.txtBuscar.nativeElement.value = ''; */
  }
}
