import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-chat-open',
  templateUrl: './button-chat-open.component.html',
  styleUrls: ['./button-chat-open.component.scss'],
})
export class ButtonChatOpenComponent implements OnInit {
  @Input() totalUnreads: any;
  @Output() onOpen: EventEmitter<any> = new EventEmitter();
  @Input() botton1: boolean=true;
  constructor() {}

  ngOnInit(): void {}
  openChat() {
    this.onOpen.emit();
  }
}
