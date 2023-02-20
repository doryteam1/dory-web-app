import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';


@Component({
  selector: 'app-user-question-forum',
  templateUrl: './user-question-forum.component.html',
  styleUrls: ['./user-question-forum.component.scss'],
})
export class UserQuestionForumComponent implements OnInit {
  @Output() onDelete: EventEmitter<boolean> = new EventEmitter();
  @Output() onDetalles: EventEmitter<boolean> = new EventEmitter();
  @Input() pregunta!: any;
  @Input() authUserId: boolean = false;
  openRespuestas: boolean = false;
  edit: boolean = false;
  showError: boolean = false;
  showNotFound: boolean = false;
  loading: boolean = false;
  respuestasPregunta: any[] = [];
  constructor(private forumService: ForumService) {}

  ngOnInit(): void {}

  createComponent(): void {
    if (!this.openRespuestas && this.pregunta.countRespuestas > 0) {
      this.openRespuestas = true;
      this.loading = true;
      this.reloadAnswers(this.pregunta.id);
    } else {
      this.openRespuestas = false;
    }
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

  detalles() {
    this.onDetalles.emit();
  }

  reloadAnswers(idPregunta: number) {
    this.showError = false;
    this.showNotFound = false;
    this.forumService.getRespuestasPregunta(idPregunta).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.respuestasPregunta = response?.data?.slice(0, 2);
          this.loading = false;
        } else {
          this.loading = false;
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        this.loading = false;
        this.showNotFound = false;
        this.showError = true;
      }
    );
  }

  timeToNow(date: string) {
    return Utilities.dateFromX(date);
  }

}
