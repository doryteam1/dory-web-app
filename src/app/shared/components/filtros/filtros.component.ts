import { Component, EventEmitter,Input, OnInit, Output } from '@angular/core';
import { AppModalService } from '../../services/app-modal.service';
import { Filtro, MetaFiltro } from '../../../../models/filtro.model';
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
  @Input() filtroSeleccionado: MetaFiltro | null = null;
  @Output() onFilterSeleccionado: EventEmitter<any> = new EventEmitter();
  @Output() onArrayCheckboxSelec: EventEmitter<any[]> = new EventEmitter();
  arrayCheckboxSelec: any[] = [];
  encontradodatafilterCheckbox: any[] = [];
  constructor(private appModalService: AppModalService) {}

  ngOnInit(): void {}
  filterSeleccionado(filtroSelecOptionData: MetaFiltro) {
   if (this.filtroSeleccionado == null) {
      /* Si el filtro esta seleccionado lo marca  */
      this.filtroSeleccionado = filtroSelecOptionData;
      this.onFilterSeleccionado.emit(filtroSelecOptionData);
    } else if (filtroSelecOptionData.id == this.filtroSeleccionado!.id) {
      /* Si el filtro seleccionado es igual al que tenia guaradado
      deseleccionamos */
      this.filtroSeleccionado = null;
      this.onFilterSeleccionado.emit(null);
    }else {
      /* Si el que filtro que seleccionamos es diferente, del que  tenia guaradado
      deseleccinamos el nuevo filtro */
      this.filtroSeleccionado = filtroSelecOptionData;
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
