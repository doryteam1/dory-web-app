import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppModalService } from '../../services/app-modal.service';
import { Filtro } from '../../../../models/filtro.model';
import { Checkbox } from 'src/models/checkbox.model';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
})
export class FiltrosComponent implements OnInit {
  @Input() filtro!: Filtro[];
  /* Variables obligatorias para todos */
  @Input() checkboxfiltro: boolean = false; //Activa el filtro multiseleccion si esta en true
  /* Variables obligatoria para filtro multiseleccion */
  @Input() checkbox!: Checkbox[];
  @Input() checkboxArray!: any[]; //Array de todas las opciones que va a tener el filtro multiseleccion

  indicefiltroselec: number = -1;
  @Output() onFilterSeleccionado: EventEmitter<any> = new EventEmitter();
  @Output() onArrayCheckboxSelec: EventEmitter<any[]> = new EventEmitter();
  arrayCheckboxSelec: any[] = [];
  encontradodatafilterCheckbox: any[] = [];
  constructor(private appModalService: AppModalService) {}

  ngOnInit(): void {}
  filterSeleccionado(i: number, filtroSelecOptionData: any) {
    if (this.indicefiltroselec == i) {
      this.indicefiltroselec = -1;
      this.onFilterSeleccionado.emit(null);
    } else {
      this.indicefiltroselec = i;
      this.onFilterSeleccionado.emit(filtroSelecOptionData);
    }
  }

  ClicFiltroButton() {
    let arrayCheckbox = this.checkboxArray;
    let titulomodal = this.checkbox[0].titulomodal;
    this.appModalService
      .modalCheckboxListComponent(
        arrayCheckbox,
        this.arrayCheckboxSelec,
        titulomodal
      )
      .then((result: any) => {
        if (result.length !== 0) {
          this.arrayCheckboxSelec = result;
        } else {
          this.arrayCheckboxSelec = [];
        }
        this.onArrayCheckboxSelec.emit(this.arrayCheckboxSelec);
      })
      .catch((result) => {
        this.arrayCheckboxSelec = [];
        this.onArrayCheckboxSelec.emit(this.arrayCheckboxSelec);
      });
  }
}
