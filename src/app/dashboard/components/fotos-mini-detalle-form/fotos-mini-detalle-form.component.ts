import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-fotos-mini-detalle-form',
  templateUrl: './fotos-mini-detalle-form.component.html',
  styleUrls: ['./fotos-mini-detalle-form.component.scss'],
})
export class FotosMiniDetalleFormComponent implements OnInit {
  @Input() fotos: Array<string | SafeUrl> = [];
  @Input() modalMode: string = 'update';
  @Input() loadingphoto: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  openPhotosModal() {
    this.onDetalle.emit();
  }
}
