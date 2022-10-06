import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-basic-floating-btn',
  templateUrl: './basic-floating-btn.component.html',
  styleUrls: ['./basic-floating-btn.component.scss'],
})
export class BasicFloatingBtnComponent implements OnInit {
  @Input() agregar: boolean = false;
  @Input() editar: boolean = false;
  @Input() actualizar: boolean = false;
  @Input() cancelar: boolean = false;
  @Input() tooltip:string = '';

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    console.log('Submit');
  }
}
