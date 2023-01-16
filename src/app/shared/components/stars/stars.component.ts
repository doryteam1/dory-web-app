import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnInit {
  @Input() overStar: number = 0;
  isAuthUser: boolean = false;
  @Input() size: string = 'medium';
  @Input() selectedStar: number = -1;
  @Input() editMode: boolean = false;
  @Output() rating = new EventEmitter<number>();

  constructor(public userService: UsuarioService) {}

  ngOnInit(): void {
    this.isAuthUser = this.userService.isAuthenticated();
  }

  mouseOver(i: number) {
    if (this.isAuthUser) {
      this.overStar = i;
    }
  }

  mouseOut(i: number) {
    if (i == 0) {
      this.overStar = -1;
    }
  }

  onClick(i: number) {
    if ((this.selectedStar == -1 || this.editMode == true) && this.isAuthUser) {
      this.selectedStar = i;
      this.rating.emit(this.selectedStar);
    }
  }
}
