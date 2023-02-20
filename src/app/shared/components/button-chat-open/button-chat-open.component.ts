import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-button-chat-open',
  templateUrl: './button-chat-open.component.html',
  styleUrls: ['./button-chat-open.component.scss'],
})
export class ButtonChatOpenComponent implements OnInit {
  @Input() totalUnreads: any;
  @Output() onOpen: EventEmitter<any> = new EventEmitter();
  routesToShow: any = ['/respuesta/pregunta/','/foro'];
  isHidden: boolean = true;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route: any = event.url;
        let resultShow: boolean = this.routesToShow.some((element: any) =>
          route.includes(element)
        );
        this.isHidden = !resultShow;
      }
    });
  }
  openChat() {
    this.onOpen.emit();
  }
  /* respuesta/pregunta/ */
}
