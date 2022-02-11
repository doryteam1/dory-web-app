import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-floating-btn-auto-up',
  templateUrl: './floating-btn-auto-up.component.html',
  styleUrls: ['./floating-btn-auto-up.component.scss']
})
export class FloatingBtnAutoUpComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onClick(){

  }

  scrollToBottom(): void {
    console.log("Scroll");
    //window.scrollTo(0,document.body.scrollHeight);
    window.scrollTo(0,0);
}
}
