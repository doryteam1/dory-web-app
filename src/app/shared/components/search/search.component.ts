import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;
  @Input() buscadorpersonalizado: boolean = false;
  @Input() placeholderbuscador!: string;
  @Input() dataarrayabuscar: any[] = [];
  @Input() buscarpor: any[] = [];
  @Input() fitroactivo: boolean = false;
  @Input() namefilterbutton: string = 'Filtrar datos';
  @Input() modoFiltro!: string;
  @Input() filtros!: any[];
  valorpulsado: string = '';
  sinresultados: boolean = false;
  indicefiltroselec: number = -1;
  @Output() textSearch: EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPress: EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPressData: EventEmitter<any[]> = new EventEmitter();
  @Output() onFilterSeleccionado: EventEmitter<any[]> = new EventEmitter();
  text: string = '';
  checkboxfiltro: boolean = false;
  constructor(
    private searchBuscadorService: SearchBuscadorService,
    private appModalService: AppModalService,
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
    /*   this.indicefiltroselec = -1; */
    console.log('filtro indice', this.indicefiltroselec);
    if (this.indicefiltroselec == -1) {
      const valor = this.txtBuscar.nativeElement.value;
      if (valor.trim().length === 0) {
        return this.keyEnterPressData.emit(this.dataarrayabuscar);
      }
      this.searchBuscadorService.buscarData(
        this.dataarrayabuscar,
        valor.toLowerCase(),
        this.buscarpor
      );

      this.keyEnterPressData.emit(this.arrayDataSearch);
      if (this.arrayDataSearch.length == 0) {
        this.valorpulsado = valor;
        this.sinresultados = true;
      } else {
        this.valorpulsado = '';
        this.sinresultados = false;
      }
      console.log(this.arrayDataSearch);
    } else {
      const valor = this.txtBuscar.nativeElement.value;
      if (valor.trim().length === 0) {
        return this.keyEnterPressData.emit(this.arrayDataFilter);
      }
      this.searchBuscadorService.buscarData(
        this.arrayDataFilter,
        valor.toLowerCase(),
        this.buscarpor
      );
      this.keyEnterPressData.emit(this.arrayDataSearch);
      if (this.arrayDataSearch.length == 0) {
        this.valorpulsado = valor;
        this.sinresultados = true;
      } else {
        this.valorpulsado = '';
        this.sinresultados = false;
      }
      console.log(this.arrayDataSearch);
    }
  }
  filterSeleccionado(i: number, filtroSelecData: any) {
    this.indicefiltroselec = i;
    this.valorpulsado = '';
    this.sinresultados = false;
    this.txtBuscar.nativeElement.value = '';
    console.log(filtroSelecData);
    this.searchBuscadorService.filterArray(
      this.dataarrayabuscar,
      filtroSelecData,
      this.modoFiltro
    );
    this.onFilterSeleccionado.emit(this.arrayDataFilter);
  }
  ClicFiltroButton(checkbox: boolean,arrayCheckbox:any[]) {
    this.checkboxfiltro = checkbox;
    console.log(arrayCheckbox)
    if (checkbox) {
      this.appModalService
        .modalCheckboxListComponent(arrayCheckbox, 'Municipios de sucre')
        .then((result) => {
          console.log(result);
        })
        .catch((result) => {
          console.log(result);
        });
    }else{
      return;
    }
  }
  get arrayDataSearch() {
    return this.searchBuscadorService.getArraydataSearch;
  }
  get arrayDataFilter() {
    return this.searchBuscadorService.getArraydataFilter;
  }
}
