import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';
@Component({
  selector: 'app-user-answers-forum',
  templateUrl: './user-answers-forum.component.html',
  styleUrls: ['./user-answers-forum.component.scss'],
})
export class UserAnswersForumComponent implements OnInit {
  edit: boolean = false;
  @Input() data: any;
  @Input() dataAll: boolean = false;
  @Input() activeRespuesta: boolean = false;
  @Input() activeCursor: boolean = false;
  @Output() onShowForm: EventEmitter<boolean> = new EventEmitter();
  @Output() onDelete: EventEmitter<boolean> = new EventEmitter();
  @Output() onDetalles: EventEmitter<boolean> = new EventEmitter();
  @Input() authUserId: boolean = false;
  showLightbox: boolean = false;
  showLess: boolean = true;
  constructor() {}

  ngOnInit(): void {
  }
  editar() {
    if (!this.edit) {
      this.edit = true;
    } else {
      this.edit = false;
    }
  }
  delete() {
    this.onDelete.emit();
  }
  timeToNow(date: string) {
    return Utilities.dateFromX(date);
  }

  detalles() {
    this.onDetalles.emit();
  }
  fotoSeleLightbox() {
    this.showLightbox = !this.showLightbox;
  }
  toggleContent() {
    this.showLess = !this.showLess;
  }
}
