import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chip-con-boton-close',
  templateUrl: './chip-con-boton-close.component.html',
  styleUrls: ['./chip-con-boton-close.component.scss'],
})
export class ChipConBotonCloseComponent{
  @Input() imgIconoChip!: string;
  @Input() contenidoChip!: string;
  @Input() iconoChip: boolean = false;
  @Output() onCloseClip: EventEmitter<any> = new EventEmitter();
  delateChip(){
    this.onCloseClip.emit()
  }
}
