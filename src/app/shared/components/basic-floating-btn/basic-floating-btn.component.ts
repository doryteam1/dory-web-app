import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-basic-floating-btn',
  templateUrl: './basic-floating-btn.component.html',
  styleUrls: ['./basic-floating-btn.component.scss']
})
export class BasicFloatingBtnComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  
  onClick(){
    console.log("Submit");
  }
}
