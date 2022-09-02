import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
/* import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Subscription,Observable, of } from 'rxjs';
import { ComunicacionEntreComponentesService } from '../../services/comunicacion-entre-componentes.service'; */

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;
  @Input() buscadorpersonalizado: boolean = false;
  @Input() placeholderbuscador!: string;
  valorpulsado: string = '';
  sinresultados: boolean = false;
  @Output() textSearch: EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPress: EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPressData: EventEmitter<string> = new EventEmitter();
  text: string = '';
  constructor(

  ) {}
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
