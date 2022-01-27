import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-floating-btn',
  templateUrl: './floating-btn.component.html',
  styleUrls: ['./floating-btn.component.scss']
})
export class FloatingBtnComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    console.log("Submit");
  }

}
